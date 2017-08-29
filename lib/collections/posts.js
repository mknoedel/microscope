Posts = new Mongo.Collection('posts');

//---- Allow/Deny ----//
Posts.allow({
    update: function (userId, post) {
        return ownsDocument(userId, post);
    },
    remove: function (userId, post) {
        return ownsDocument(userId, post);
    }
});
Posts.deny({
    update: function (userId, post, fieldNames) {
        // may only edit the following two fields:
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
});

//---- Functions ----//
validatePost = function (post) {
    let errors = {};

    if (!post.title)
        errors.title = "Please fill in a headline";

    if (!post.url)
        errors.url = "Please fill in a URL";

    return errors;
}

//---- Methods ----//
Meteor.methods({
    postUpdate: function (postAttributes) {
        check(this.userId, String);
        check(postAttributes, {
            title: String,
            url: String,
            id: String
        });
        console.log(postAttributes);

        let postWithSameLink = Posts.findOne({url: postAttributes.url});
        if (postWithSameLink) {
            return {
                urlExists: true,
                _id: postWithSameLink._id
            }
        }
        return Posts.update(postAttributes.id, { $set: postAttributes });
    },
    postInsert: function (postAttributes) {
        check(this.userId, String);
        check(postAttributes, {
            title: String,
            url: String
        });
        
        let errors = validatePost(postAttributes);
        if (errors.title || errors.url)
            throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");

        let postWithSameLink = Posts.findOne({url: postAttributes.url});
        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            }
        }

        let user = Meteor.user();
        let post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date()
        });

        let postId = Posts.insert(post);

        return {
            _id: postId
        };
    }
});