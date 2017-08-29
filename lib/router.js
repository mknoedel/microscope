Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        return [Meteor.subscribe("notifications")];
    }
});

//---- Controllers ----//
    PostsListController = RouteController.extend({
        template: 'postsList',
        increment: 5,
        postsLimit: function () {
            return parseInt(this.params.postsLimit) || this.increment;
        },
        sort: {submitted: -1},
        waitOn: function () {
            return Meteor.subscribe("posts", this.sort, this.postsLimit());
        },
        data: function () {
            return {posts: Posts.find({}, this.sort, this.postsLimit())};
        }
    })

//---- Routes ----//

// Base Route //
    Router.route('/:postsLimit?', {
        name: 'postsList'
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
