Package.describe({
    name: 'intercom',
    summary: "Intercom package",
    version: '1.0.0'
});
Package.onUse(function (api) {
    api.versionsFrom('0.9.4');
    api.addFiles('intercom_loader.js', 'client')
});