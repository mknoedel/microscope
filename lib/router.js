Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        return [Meteor.subscribe("notifications")];
    }
});

//---- Routes ----//

// Base Route //
    Router.route('/:postsLimit?', {
        name: 'postsList',
        waitOn: function () {
            let limit = parseInt(this.params.postsLimit) || 5;
            return Meteor.subscribe("posts", {submitted: -1}, limit);
        },
        data: function () {
            let limit = parseInt(this.params.postsLimit) || 5;
            return {
                posts: Posts.find({}, {sort: {submitted: -1}, limit: limit})
            }
        }
    });
// Post Page View //
    Router.route('/posts/:_id', {
        name: 'postPage',
        waitOn: function () {
            return Meteor.subscribe("comments", this.params._id);
        },
        data: function () { return Posts.findOne(this.params._id); }
    });
// Edit Post //
    Router.route('/posts/:_id/edit', {
        name: 'postEdit',
        data: function () { return Posts.findOne(this.params._id); }
    });
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
