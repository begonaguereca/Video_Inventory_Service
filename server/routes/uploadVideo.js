const express = require('express');
const router = express.Router();
const bluebird = require('bluebird');
const Consumer = require('sqs-consumer');
const db = require('../../database-mysql');
const Producer = require('sqs-producer');
const Consumer = require('sqs-consumer');
const amazonKeys = require('../keys.js');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: amazonKeys.keys.accessKeyId,
  secretAccessKey: amazonKeys.keys.secretAccessKey
});

const producer = Producer.create({
  queueUrl: 'https://sqs.us-east-2.amazonaws.com/558725748654/VideoUploadQue',
  region: 'us-east-2',
  accessKeyId: amazonKeys.keys.accessKeyId,
  secretAccessKey: amazonKeys.keys.secretAccessKey
});


//Queue is polled continuously for new Videos using long polling
  const que = Consumer.create({
    queueUrl: 'https://sqs.us-east-2.amazonaws.com/558725748654/VideoUploadQue',
    handleMessage: (message, done) => {
      var message = JSON.stringify(req.body);
      message['url'] = generatorURL();

      db.addVideoAsync(message)
      .then(data => {
        res.status(200).send();

        //Sending Video Package to Client API Queue
          producer.send([{
            id: data.insertId,
            body: JSON.stringify(message),
          }], (err) => {
            if (err) { console.log(err) }
            res.status(200).send('Data enqueued');
          })
        })
        .catch(err => {
          console.log(err)
          res.sendStatus(500)
        });
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(500)
      });
        done();
      },
    sqs: new AWS.SQS()
    });
    que.on('error', (err) => { console.log(err.message) });
    que.start();



  ///////////////////////helper URL Generator function//////////////////
  var generatorURL = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 11; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return 'https://www.youtube.com/watch?v=' + text;
  }

  module.exports = router;
