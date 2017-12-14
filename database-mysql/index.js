var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'begona',
  password : 'begona',
  database : 'video_inventory'
});


var addVideo = function(videoObj, callback) {
  var insertQuery = 'INSERT INTO main (video_url, published_at, channel_id, title, description, thumb_url, thumb_width, thumb_height, channel_title, category_id, duration)'
  var queryInput = [[generatorURL(), videoObj.snippet.publishedAt, videoObj.snippet.channelId, videoObj.snippet.title, videoObj.snippet.description, videoObj.thumbnails.url, videoObj.thumbnails.width, videoObj.thumbnails.height, videoObj.channelTitle, videoObj.category_id, videoObj.duration]]
  connection.query(insertQuery, [queryInput], function(err, results, fields) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

var generatorURL = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 11; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return 'https://www.youtube.com/watch?v=' + text;
}

module.exports.addVideo = addVideo;
