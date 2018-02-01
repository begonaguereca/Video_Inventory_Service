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

  it('SQL query will return a video duration', function(done) {
    var options = {
      'method': 'GET',
      'uri': 'http://127.0.0.1:3000/time',
      'json': {
        'video_id': 20
      }
    };

    request(options, function(error, res, body) {

      var queryString = 'SELECT duration FROM Main WHERE id = 20;';
      db.query(queryString, function(err, data) {
        if (err) { done(err); }
        var videoRecord = data[0];
        expect(videoRecord).to.exist;
        expect(videoRecord.duration).to.equal(1918);
        done();
      });
    });
  });

  it('a Request to Time Route will return a video duration and ID', function(done) {
    var options = {
      'method': 'GET',
      'uri': 'http://127.0.0.1:3000/time',
      'json': {
        'video_id': 20
      }
    };

    request(options, function(error, res, body) {
      expect(body).to.exist;
      expect(body.duration).to.equal('1918');
      expect(body.video_id).to.equal(20);
      done();
    });
  });
});
