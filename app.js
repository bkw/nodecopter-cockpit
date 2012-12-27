'use strict';
var express = require('express')
  , routes = require('./routes')
  , app = express()
  , path = require('path')
  , server = require("http").createServer(app)
  , WebSocketServer = require('ws').Server
  , navWss = new WebSocketServer({server: server, path: '/navdata'})
  , navdataSockets = []
  , arDrone = require('ar-drone')
  ;



app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade', { pretty: true });
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
    app.locals.pretty = true;
});

app.get('/', routes.index);

/*
 * Important:
 *
 * pass in the server object to listen, not the express app
 * call 'listen' on the server, not the express app
 */
require("dronestream").listen(server);

var client = new arDrone.createClient();
client.config('general:navdata_demo', 'FALSE');
client.on('navdata', function (d) {
    navdataSockets.forEach(function (socket) {
        socket.send(JSON.stringify(d));
    });
});

navWss.on('connection', function (socket) {
    navdataSockets.push(socket);

    socket.on("close", function () {
        console.log("Closing Navdata socket");
        navdataSockets = navdataSockets.filter(function (el) {
            return el !== socket;
        });
    });
});

server.listen(3000);

