//Starting point of Node Express server.
var path = require("path");

var config = {
    port: 4008,
    appPath: __dirname,
    routesPath:__dirname+"/Routes",
    servicesPath: {
        servicePath: __dirname + "/./Services/"
    },
    apiPath:__dirname+"/API",
    appConfigPath: __dirname + "/./appConfig.json"
};

var app = require("./Myserver");
var d = new app(config);

d.initialise((err, res)=> {
    if (err) {
        console.log("---------error while initialisng app---", err);
        return;
    }
});

