Template.postEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        let currentPostId = this._id;

        let postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val(),
            id: currentPostId
        };

        Meteor.call('postUpdate', postProperties, function(error, result) {
            //  display the error to the user and abort
            if (error)
                return alert(error.reason);

            if (result.urlExists)
                alert('This link has already been posted');

            else Router.go('postPage', {_id: currentPostId});
        });
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            let currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('postsList');
        }
    }
});