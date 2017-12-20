var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mysql');
var app = express();
var fs = require('graceful-fs');
var winston = require('winston'),expressWinston = require('express-winston');
var Elasticsearch = require('winston-elasticsearch');
var redis = require("redis"), client = redis.createClient();

app.use(expressWinston.logger({ transports: [ new Elasticsearch({level: 'info'})]}));
app.use(require('express-status-monitor')());
app.use(express.static(__dirname + '/../react-client/dist'));

//Initializing cache
client.on("error", function (err) {
    console.log("Error " + err);
});

//Route to upload a new Video
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

//Route to query an existing video length
app.get('/time', function (req, res) {
  //var video_id = req.body.id;
  var video_id = 9;

  client.get(video_id, function(err, reply) {
    if (reply) {
      var videoObj = {
        video_id: video_id,
        duration: JSON.parse(reply)
      }
      res.send(videoObj);
    } else {
      db.retrieveVideoLength(video_id, function(err, data) {
        if(err) {
          console.log(err)
          res.sendStatus(500);
        } else {
          videoObj = data[0];
          videoObj['video_id'] = video_id;
          client.set(video_id, data[0].duration);
          res.send(videoObj);
        }
      });
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
//////////////////////////PREVIOUSWORK///////////////////////////////

///////////////ROUTE WITHOUT REDIS
// app.get('/time', function (req, res) {
//   //var video_id = req.body.id;
//   var video_id = 10;
//
//   db.retrieveVideoLength(video_id, function(err, data) {
//     if(err) {
//       console.log(err)
//       res.sendStatus(500);
//     } else {
//       var videoObj = data[0];
//       videoObj['video_id'] = video_id;
//       res.send(videoObj);
//     }
//   });
// });
//
