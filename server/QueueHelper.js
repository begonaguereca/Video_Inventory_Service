const axios = require('axios');
const AWS = require('aws-sdk');
const Consumer = require('sqs-consumer');
var Keys = require('./keys.js');


AWS.config.update({
  region: 'us-east-2',
  accessKeyId: Keys.keys.accessKeyId,
  secretAccessKey: Keys.keys.secretAccessKey
});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});


//Consumer will receive and delete messages from the SQS queue
const polling = Consumer.create({
    queueUrl: 'https://sqs.us-east-2.amazonaws.com/558725748654/VideoUploadQue',
    handleMessage: (message, done) => {

    ///HANDLE THE MESSAGE

    //Delete messages from queue
    done();
   },
  sqs: new AWS.SQS()
});



polling.on('error', (err) => {
  console.log(err.message);
});


//Start polling the queue for messages
polling.start();
