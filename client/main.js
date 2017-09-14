Tracker.autorun(function () {
    if (Meteor.user() && !Meteor.loggingIn()) {
        let intercomSettings = {
            name: Meteor.user().username,
            email: Meteor.user().emails[0].address,
            created_at: Math.round(Meteor.user().createdAt / 1000), // Current UNIX timestamp,
            favorite_color: _.sample(['blue', 'red', 'green', 'yellow']),
            user_id: Meteor.user()._id,
            user_hash: Meteor.user().intercomHash,
            widget: {
                activator: '#Intercom',
                use_counter: true
            },
            app_id: "tded6jmr"
        };
        Intercom('boot', intercomSettings);
    }
});