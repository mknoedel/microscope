Accounts.onCreateUser(function (options, user) {
    user.intercomHash = IntercomHash(user, 'HowManyApplesCanIEat???5');

    if (options.profile)
        user.profile = options.profile;

    return user;
});
