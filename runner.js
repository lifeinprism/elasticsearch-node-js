const keys = require('./keys.js');
const _ = require('underscore');
const Twitter = require('twitter');
const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  hosts: ['http://localhost:9200']
})


const client = new Twitter({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token_key: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});


const months = {
  "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
  "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
}


var params = {screen_name: process.argv[2]};
client.get('statuses/user_timeline', params, (err, tweets, resp) => {
  if (!err) {
    _.each(tweets, tweet =>
    {
      var dateParse = tweet.created_at.split(' ')
      dateParse = `${dateParse[5]}-${months[dateParse[1]]}-${dateParse[2]}`

      elasticClient.exists({
        index: 'twitter',
        type: 'tweets',
        id: tweet.id_str
      }, function (err, exists) {
        if (exists) {
          elasticClient.delete({
            index: 'twitter',
            type: 'tweets',
            id: tweet.id_str
          });
          insertData(tweet, dateParse);
        } else {
          insertData(tweet, dateParse);
        }
      });
  })} else {
    console.log(`there was an error`);
  }
});


var insertData = (tweet, dateParse) => elasticClient.index({
  index: 'twitter',
  type: 'tweets',
  id: tweet.id_str,
  body: {
    "name": tweet.user.name,
    "message_date": dateParse,
    "message": tweet.text,
    "link": tweet.user.url
  }
}, (err, resp, status) => {
  console.log(resp);
});