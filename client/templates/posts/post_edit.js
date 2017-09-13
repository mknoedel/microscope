Template.postEdit.onCreated(function () {
    Session.set("postEditErrors", {});
});

Template.postEdit.helpers({
    errorMessage: function (field) {
        return Session.get("postEditErrors")[field];
    },
    errorClass: function (field) {
        return !!Session.get("postEditErrors")[field] ? 'has-error' : '';
    }
});

Template.postEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        let currentPostId = this._id;

        let postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val(),
            id: currentPostId
        };
        
        let errors = validatePost(postProperties);
        if (errors.title || errors.url)
            return Session.set("postEditErrors", errors);

        Meteor.call('postUpdate', postProperties, function(error, result) {
            //  display the error to the user and abort
            if (error)
                return throwError(error.reason);

            if (result.urlExists)
                throwError('This link has already been posted');

            else Router.go('postPage', {_id: currentPostId});
        });
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            let currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('home');
        }
    }
});