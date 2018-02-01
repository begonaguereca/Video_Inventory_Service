const express = require('express');
const router = express.Router();
const redis = require("redis"), client = redis.createClient();
const db = require('../../database-mysql');
const bluebird = require('bluebird');
const amazonKeys = require('../keys.js');
const Producer = require('sqs-producer');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const producer = Producer.create({
  queueUrl: 'https://sqs.us-east-2.amazonaws.com/558725748654/videoDuration',
  region: 'us-east-2',
  accessKeyId: amazonKeys.keys.accessKeyId,
  secretAccessKey: amazonKeys.keys.secretAccessKey
});

//Query an existing video length
router.get('/', (req, res) => {
  var video_id = req.body.video_id;

  //Checking to see if ID is already in cache
  client.getAsync(video_id)
    .then(reply => {
      //If ID is in cashe return duration
      if (reply) {
        var videoObj = { video_id: video_id, duration: reply}
        res.status(200)

        //send response to SQS queue
        producer.send([{
          id: 'id1',
          body: JSON.stringify(videoObj),
        }], (err) => {
          if (err) { console.log(err) }
          res.status(200).send('Data enqueued');
        });

      //If ID is NOT in cashe: 1) Query DB 2) Add data to cashe 3) return duration
      } else {
        db.retrieveVideoLengthAsync(video_id)
          .then(data => {
            client.set(video_id, data[0].duration);
            videoObj = data[0];
            videoObj['video_id'] = video_id;
            res.status(200).send('Data enqueued');

            //send response to SQS queue
            producer.send([{
              id: 'id1',
              body: JSON.stringify(videoObj),
              groupId: 'testGroup',
              deduplicationId: 'testID'
            }], (err) => {
              if (err) { console.log(err) }
              res.status(200).send('Data enqueued');
            });

          })
        .catch(err => {
          console.err(err)
          res.sendStatus(500)
        })
      }
    })
    .catch(err => console.log(err))
  });

  module.exports = router;
