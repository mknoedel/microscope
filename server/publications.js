Meteor.publish('posts', function(sort, limit) {
    console.log(sort);
    console.log(limit);
    check(sort, Object);
    check(limit, Number);
    return Posts.find({}, {sort: sort, limit: limit});
});

Meteor.publish("comments", function (postId) {
    check(postId, String);
    return Comments.find({postId: postId});
});

Meteor.publish("notifications", function () {
    return Notifications.find({userId: this.userId, read: false});
});