var list = require('./largeWordList');

var newMainRec= function() {
  var publishedAt = timeCreated();
  var channelId =  createCategoryId();
  var title = createTitle();
  var description = createDescription();
  var thumb_url = thumbnailURL();
  var thumb_width = 120;
  var thumb_height = 90;
  var channelTitlething= channelTitle();
  var categoryId = createCategoryId();
  var durationTime = duration();
  var newUrl = generatorURL();
  var nullValue = JSON.stringify('/N');

  return nullValue + "\t" + newUrl + "\t" + publishedAt + "\t" + channelId + "\t" + title + "\t" + description + "\t" + thumb_url + "\t" + thumb_width + "\t" + thumb_height + "\t" + channelTitlething + "\t" + categoryId + "\t" + durationTime
};

var newStatsRec = function() {
  var newStats = statistics();

  var nullValue = JSON.stringify('/N');
  var viewCount = newStats.viewCount;
  var likeCount = newStats.likeCount;
  var dislikeCount = newStats.dislikeCount;
  var favoriteCount = newStats.favoriteCount;
  var commentCount = newStats.commentCount;
  var count = counterReal();

  return nullValue + "\t" + viewCount + "\t" +  likeCount + "\t" +  dislikeCount + "\t" +  favoriteCount + "\t" + commentCount;
};

var newTags = function() {
  var nullValue = JSON.stringify('/N');
  var videoTag = videoTags();

  return nullValue + "\t" + videoTag;
}

module.exports.newTags = newTags;


/////////////////////////////////////////FORMULAS/////////////////////////////////////////////////////

var counterReal = function() {
  var counter = 0;

  counter++;
  return counter;
}

var newTagsRec = function() {
  var tags = videoTags();
};


var generatorURL = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 11; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return 'https://www.youtube.com/watch?v=' + text;
}

var createTitle = function() {
  var word1 = list.wordList[Math.floor(Math.random() * list.wordList.length)];
  var word2 = list.wordList[Math.floor(Math.random() * list.wordList.length)];

  return word1 + ' ' + word2;
}

var createDescription = function() {
  var text = "";

  for (var i = 0; i < 11; i++) {
    text += ' ' + list.wordList[Math.floor(Math.random() * list.wordList.length)];
  }
  return text;
};

//TIMESTAMP: '1970-01-01 00:00:01'
var timeCreated = function() {
  var dt = new Date();
  var utcDate = dt.toUTCString();
  return utcDate;
}

var thumbnailURL = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 11; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return 'https://i.ytimg.com/vi/' + text + '.jpg';
}

var channelTitle = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 24; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

var videoTags = function() {
  var arrTags = [];
  var index = Math.ceil(Math.random() * (list.wordList.length - 10));
  var numTags = Math.ceil(Math.random() * 10);

  for (var i = 0; i < numTags; i++) {
    arrTags.push(list.wordList[index + i]);
  }
  return JSON.stringify(arrTags);
};

var statistics = function() {
  var viewCount = Math.floor(Math.random() * 20000000);
  var likeCount = Math.floor(Math.random() * (viewCount * 0.25));
  var dislikeCount = Math.floor(Math.random() * (viewCount * 0.0002));
  var favoriteCount = Math.floor(Math.random() * (viewCount * 0.000002));
  var commentCount = Math.floor(Math.random() * (viewCount * 0.0005));

  var arrStats = {
    "viewCount": viewCount,
    "likeCount": likeCount,
    "dislikeCount": dislikeCount,
    "favoriteCount": favoriteCount,
    "commentCount": commentCount
  };

  return arrStats;
};

var createCategoryId = function() {
  var youTubeId = [1,2,23,27,24,20,26,10,25,29, 22, 15, 28, 17, 19]
  var id = youTubeId[Math.floor(Math.random() * youTubeId.length)];
  return id;
}

var duration = function() {
  var seconds =  Math.floor(Math.random() * 3600);
  return seconds;
}
/////////////////////////////SERVER FOR LOOP/////////////////////////////////////////
///Insert belwo commands into MYSQL server
//LOAD DATA LOCAL INFILE 'fakeData.txt' INTO TABLE Main;
//LOAD DATA LOCAL INFILE 'StatsData.txt' INTO TABLE Statistics;
//LOAD DATA LOCAL INFILE 'tagsData.txt' INTO TABLE Tags;

// var writeStream = fs.createWriteStream('tagsData.txt');
// var counter = 1;
//
//   for (var i = 1 ; i <= 3333333; i++) {
//     var newVideo = dataCreate.newTags();
//     newVideo = newVideo + "\t" + i + "\n";
//
//     writeStream.write(newVideo, (err) => {
//       if (err) {
//         console.log(err)
//         res.sendStatus(500);
//       }
//     });
//   }
// writeStream.end();
