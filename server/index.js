var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mysql');
var dataCreate = require('../data/dataCreation');
var app = express();
var fs = require('graceful-fs');
var winston = require('winston'),expressWinston = require('express-winston');
var Elasticsearch = require('winston-elasticsearch');

app.use(expressWinston.logger({
      transports: [
        new Elasticsearch({level: 'info'})
      ],
      // meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      // msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      // expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      // colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      // ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
  }));

app.use(require('express-status-monitor')());
app.use(express.static(__dirname + '/../react-client/dist'));

app.post('/upload', function (req, res) {
  var newVideo = req.body.video;
  newVideo['url'] = generatorURL();

  db.addVideo(newVideo, function(err, data) {
    if(err) {
      console.log(err)
      res.sendStatus(500);
    } else {
      newVideo.id = data.id
      res.send(newVideo);
    }
  });
});

app.get('/time', function (req, res) {
  //var video_id = req.body.id;
  var video_id = 5;

  db.retrieveVideoLength(video_id, function(err, data) {
    if(err) {
      console.log(err)
      res.sendStatus(500);
    } else {
      var videoObj = data[0];
      videoObj['video_id'] = video_id;
      res.send(videoObj);
    }
  });
});

app.listen(3000, function() {
  console.log('listening on port 3000!');
});


/////////////////////helper functions /////////////////////
var generatorURL = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 11; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return 'https://www.youtube.com/watch?v=' + text;
}
