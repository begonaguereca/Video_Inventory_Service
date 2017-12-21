var mysql = require('mysql');
var Promise = require('bluebird');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'begona',
  password : 'begona',
  database : 'Video_Inventory'
});


connection.addVideo = (videoObj, callback) => {
  var insertMainQuery = 'INSERT INTO main (video_url, published_at, channel_id, title, description, thumb_url, thumb_width, thumb_height, channel_title, category_id, duration) VALUES ?'
  var queryMainInput = [[videoObj.url, videoObj.snippet.publishedAt, videoObj.snippet.channelId, videoObj.snippet.title, videoObj.snippet.description, videoObj.snippet.thumbnails.url, videoObj.snippet.thumbnails.width, videoObj.snippet.thumbnails.height, videoObj.snippet.channelTitle, videoObj.snippet.categoryId, videoObj.snippet.duration]]
  var mainId = null;

 //Adding Data corresponding to Main Table
  connection.query(insertMainQuery, [queryMainInput], (err, results, fields) => {
    if (err) {
      callback(err, null);
    } else {
      var insertStatsQuery = 'INSERT INTO Statistics (video_id, view_count, like_count, dislike_count, favorite_count, comment_count) VALUES ?'
      var queryStatsInput = [[results.insertId, videoObj.snippet.statistics.viewCount, videoObj.snippet.statistics.likeCount, videoObj.snippet.statistics.dislikeCount, videoObj.snippet.statistics.favoriteCount, videoObj.snippet.statistics.commentCount]]
      mainId = results.insertId;

      //Adding Data corresponding to Stats Table
      connection.query(insertStatsQuery, [queryStatsInput], (err, results, fields) => {
        if (err) {
          callback(err, null);
        } else {
          var insertStatsQuery = 'INSERT INTO Tags (video_id, tag) VALUES ?'
          var queryStatsInput = [[mainId,videoObj.snippet.Tags]]

          //Adding Data corresponding to Tags Table
          connection.query(insertStatsQuery, [queryStatsInput], (err, results, fields) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, results);
            }
          });
        }
      });
    }
  });
};

connection.retrieveVideoLength = (videoID, callback) => {
  var selectQuery = 'SELECT duration FROM Main WHERE id = ?'
  var queryInput = [[videoID]]

  connection.query(selectQuery, [queryInput], (err, results, feilds) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// module.exports.addVideo = addVideo;
// module.exports.retrieveVideoLength = retrieveVideoLength;
module.exports = Promise.promisifyAll(connection);
