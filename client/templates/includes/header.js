Template.header.helpers({
    activeRouteClass: function (/* route names */) {
        let args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        let active = _.any(args, function(name) {
            return Router.current() && Router.current().route.getName() === name
        });

        return active && 'active';
    }
});