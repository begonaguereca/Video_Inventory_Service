require('newrelic');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bluebird = require('bluebird');
const winston = require('winston'), expressWinston = require('express-winston');
const Elasticsearch = require('winston-elasticsearch');
const redis = require("redis"), client = redis.createClient();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressWinston.logger({ transports: [ new Elasticsearch({level: 'info'}) ]}));
app.use(require('express-status-monitor')());


//Routes leading to files using express router
const uploadVideo = require('./routes/uploadVideo.js');
const getVideoDuration = require('./routes/getVideoDuration.js');


//Routes
app.use('/time', getVideoDuration);


// //Logging Redis connection & errors
client.on('connect', function() {
  console.log('Connected with Reddis');
});
client.on("error", (err) => {
    console.log("Error " + err);
});


app.listen(3000, () => { console.log('listening on port 3000!') });



module.exports = client;
module.exports = app;
