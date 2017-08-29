Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        return [Meteor.subscribe('posts'), Meteor.subscribe("comments")];
    }
});

//---- Routes ----//

// Base Route //
    Router.route('/', {name: 'postsList'});
// Post Detail View //
    Router.route('/posts/:_id', {
        name: 'postPage',
        data: function () { return Posts.findOne(this.params._id); }
    });
// Edit Post //
    Router.route('/posts/:_id/edit', {
        name: 'postEdit',
        data: function () { return Posts.findOne(this.params._id); }
    })
// New Post //
    Router.route('/submit', {name: 'postSubmit'});

//---- Guards ----//

// Check Login //
let requireLogin = function () {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
};

//---- Hooks ----//

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
