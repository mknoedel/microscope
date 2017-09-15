Migrations.add({
    name: 'Add intercom hash to users',
    version: 1,

    up: function () {
        var users = Meteor.users.find({intercomHash: {$exists: false}});
        users.forEach(function (user) {
            Meteor.users.update(user._id, {$set: {
                intercomHash: IntercomHash(user, 'HowManyApplesCanIEat???5')
            }});
        });
    },

    down: function () {
        Meteor.users.update({}, {$unset: {intercomHash: true}}, {multi:true});
    }
});