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
        sort: {submitted: -1},
        postsLimit: function () {
            return parseInt(this.params.postsLimit) || this.increment;
        },
        subscriptions: function () {
            this.postsSub = Meteor.subscribe("posts", this.sort, this.postsLimit());
        },
        posts: function () {
            return Posts.find({}, this.sort, this.postsLimit())
        },
        data: function () {
            let hasMore = this.posts().count() === this.postsLimit();
            let nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});
            return {
                posts: this.posts(),
                ready: this.postsSub.ready,
                nextPath: hasMore ? nextPath : null
            };
        }
    });

//---- Routes ----//

// Base Route //
    Router.route('/:postsLimit?', {
        name: 'postsList'
    });
// Post Page View //
    Router.route('/posts/:_id', {
        name: 'postPage',
        waitOn: function () {
            return [
                Meteor.subscribe("singlePost", this.params._id),
                Meteor.subscribe("comments", this.params._id)
            ]
        },
        data: function () { return Posts.findOne(this.params._id); }
    });
// Edit Post //
    Router.route('/posts/:_id/edit', {
        name: 'postEdit',
        waitOn: function () {
            return Meteor.subscribe("singlePost", this.params._id);
        },
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
