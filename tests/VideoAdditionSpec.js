const expect = require('chai').expect;
const mysql = require('mysql');
const request = require('request');
const express = require('express');
var httpMocks = require('node-mocks-http');

const app = require('../server/index.js');
//const schema = require('../server/db/config.js');
const port = 3000;

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'begona',
  password : 'begona',
  database : 'Video_Inventory'
});

describe('Video Duration retrieval', function() {

  it('SQL query will return a video object', function(done) {
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:3000/upload',
    };

    var newVideo = {"snippet":{"publishedAt":"Sat, 16 Dec 2017 00:36:06 GMT","channelId":22,"title":"anthropomorphic dazzles","description":" prefabrication turgid hierarch nobleman straying rocked clampdown peremptoriness fountain warder speculations","thumbnails":{"url":"https://i.ytimg.com/vi/yEVdVmmS6yN.jpg","width":120,"height":90},"channelTitle":"cbzSayX8m4XraQxy2lLY3fLU","Tags":"[\"irksome\",\"irksomeness\",\"iron\"]","categoryId":28,"duration":2916,"statistics":{"viewCount":13554474,"likeCount":894435,"dislikeCount":67,"favoriteCount":2,"commentCount":5196}}}

    request(options, function(error, res, body) {

      var mainQuery = 'INSERT INTO main video_url, published_at, channel_id, title, description, thumb_url, thumb_width, thumb_height, channel_title, category_id, duration VALUES "youtube.com/test", "Sat, 16 Dec 2017 00:36:06 GMT", 22, "anthropomorphic dazzles", "prefabrication turgid hierarch nobleman straying rocked clampdown peremptoriness fountain", "https://i.ytimg.com/vi/yEVdVmmS6yN.jpg", 120, 90, "cbzSayX8m4XraQxy2lLY3fLU", 28, 2916) VALUES "youtube.com/test", "Sat, 16 Dec 2017 00:36:06 GMT", 22, "anthropomorphic dazzles", "prefabrication turgid hierarch nobleman straying rocked clampdown peremptoriness fountain", "https://i.ytimg.com/vi/yEVdVmmS6yN.jpg", 120, 90, "cbzSayX8m4XraQxy2lLY3fLU", 28, 2916'
      var statsQuery = 'INSERT INTO Statistics video_id, view_count, like_count, dislike_count, favorite_count, comment_count VALUES mainId 13554474 894435 67 2 5196'
      var tagsQuery = 'INSERT INTO Tags video_id, tag VALUES mainId "[\"irksome\",\"irksomeness\",\"iron\"]"'
      var mainId;

      //INSERT INTO MAIN TABLE
      db.query(mainQuery, function(err, data) {
        if (err) { done(err); }
        var videoRecord = data[0];
        expect(videoRecord).to.exist;
        //expect(videoRecord.mainId).to.equal();

        //INSERT INTO STATS TABLE
        db.query(statsQuery, function(err, data) {
          if (err) { done(err); }
          mainId = results.insertId;
          var videoRecord = data[0];
          expect(videoRecord).to.exist;
          //expect(videoRecord.duration).to.equal(1918);

          //INSERT INTO TAGS TABLE
          db.query(tagsQuery, function(err, data) {
            if (err) { done(err); }
            var videoRecord = data[0];
            expect(videoRecord).to.exist;
            //expect(videoRecord.duration).to.equal(1918);
            done();
          });
        });
      });
    });
  });

  it('a Request to Time Route will return a video duration and ID', function(done) {
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:3000/upload',
      'json': {"snippet":{"publishedAt":"Sat, 16 Dec 2017 00:36:06 GMT","channelId":22,"title":"anthropomorphic dazzles","description":" prefabrication turgid hierarch nobleman straying rocked clampdown peremptoriness fountain warder speculations","thumbnails":{"url":"https://i.ytimg.com/vi/yEVdVmmS6yN.jpg","width":120,"height":90},"channelTitle":"cbzSayX8m4XraQxy2lLY3fLU","Tags":"[\"irksome\",\"irksomeness\",\"iron\"]","categoryId":28,"duration":2916,"statistics":{"viewCount":13554474,"likeCount":894435,"dislikeCount":67,"favoriteCount":2,"commentCount":5196}}
      }
    };

    request(options, function(error, res, body) {
      expect(body).to.exist;
      expect(body.video_id).to.exist;
      expect(body.video_url).to.exist;
      //expect(body.duration).to.equal('1918');
      //expect(body.video_id).to.equal(20);
      done();
    });
  });
});
