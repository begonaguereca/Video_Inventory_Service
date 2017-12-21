var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mysql');
var app = express();
var winston = require('winston'),expressWinston = require('express-winston');
var Elasticsearch = require('winston-elasticsearch');
var bluebird = require('bluebird');
var redis = require("redis"), client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use(expressWinston.logger({ transports: [ new Elasticsearch({level: 'info'}) ]}));
app.use(require('express-status-monitor')());
app.use(express.static(__dirname + '/../react-client/dist'));

//Initializing cache
client.on("error", (err) => {
    console.log("Error " + err);
});

//Route to upload a new Video
app.post('/upload', (req, res) => {
  //var newVideo = req.body.video;
  var newVideo = {"snippet":{"publishedAt":"Sat, 16 Dec 2017 00:36:06 GMT","channelId":22,"title":"anthropomorphic dazzles","description":" prefabrication turgid hierarch nobleman straying rocked clampdown peremptoriness fountain warder speculations","thumbnails":{"url":"https://i.ytimg.com/vi/yEVdVmmS6yN.jpg","width":120,"height":90},"channelTitle":"cbzSayX8m4XraQxy2lLY3fLU","Tags":"[\"irksome\",\"irksomeness\",\"iron\"]","categoryId":28,"duration":2916,"statistics":{"viewCount":13554474,"likeCount":894435,"dislikeCount":67,"favoriteCount":2,"commentCount":5196}}}
  newVideo['url'] = generatorURL();

  db.addVideoAsync(newVideo)
    .then(data => {
      newVideo['video_id'] = data.insertId

      //sending Event to Event Service
        // axios.post('/newUpload', newVideo)
        // .then(response => {
        //   console.log(response);
        // })
        // .catch(error => {
        //   console.log(error);
        // });
      //sending Uploaded video to Client Service
      res.send(newVideo);
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
  });

//Route to query an existing video length
app.get('/time', (req, res) => {
  //var video_id = req.body.id;
  var video_id = 20;
  //Checking to see if ID is already in cashe
  client.getAsync(video_id)
    .then(reply => {
      //If ID is in cashe return duration
      if (reply) {
        var videoObj = { video_id: video_id, duration: reply}
        res.send(videoObj);
      //If ID is NOT in cashe: 1) Query DB 2) Add data to cashe 3) return duration
      } else {
        db.retrieveVideoLengthAsync(video_id)
          .then(data => {
            client.set(video_id, data[0].duration);
            videoObj = data[0];
            videoObj['video_id'] = video_id;
            res.send(videoObj);
          })
        .catch(err => {
          console.err(err)
          res.sendStatus(500)
        })
      }
    })
    .catch(err => console.log(err))
  });

app.listen(3000, () => {
  console.log('listening on port 3000!');
});

////////////////////////////helper functions/////////////////////
var generatorURL = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 11; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return 'https://www.youtube.com/watch?v=' + text;
}
//////////////////////////PREVIOUSWORK///////////////////////////////

///////////////ROUTE WITHOUT REDIS ////////////
// app.get('/time', (req, res) => {
//   //var video_id = req.body.id;
//   var video_id = 10;
//
//   db.retrieveVideoLength(video_id, (err, data) => {
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
