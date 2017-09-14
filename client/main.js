Tracker.autorun(function () {
    if (Meteor.user() && !Meteor.loggingIn()) {
        let intercomSettings = {
            name: Meteor.user().username,
            email: "mknoedel@clearviewaudit.com",
            created_at: Math.round(Meteor.user().createdAt / 1000), // Current UNIX timestamp,
            favorite_color: _.sample(['blue', 'red', 'green', 'yellow']),
            app_id: "tded6jmr"
        };
        Intercom('boot', intercomSettings);
    }
});