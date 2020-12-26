const Twitter = require("twitter-lite");

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const now = new Date();
const maxDaysAgo = Number.parseInt(process.env.MAX_DAYS_AGO, 10);

const getMoreTweets = (options) => {
  return client.get("statuses/user_timeline", {
    user_id: process.env.USERNAME,
    include_rts: true,
    count: 200,
    ...options,
  });
};

const deleteTweet = (tweet) => {
  return client.post("statuses/destroy", { id: tweet.id_str });
};

module.exports.handler = async (event, context) => {
  try {
    let tweets = await getMoreTweets();

    while (tweets.length) {
      let lastTweetId;
      for (let tweet of tweets) {
        const tweetAge = now - new Date(Date.parse(tweet.created_at));
        const daysAgo = Math.floor(tweetAge / 60 / 60 / 24 / 1000);

        if (daysAgo >= maxDaysAgo) {
          console.log(`delete tweet: ${tweet.id_str} - ${tweet.created_at}`);
          await deleteTweet(tweet);
        } else {
          console.log(`keep tweet: ${tweet.id_str} - ${tweet.created_at}`);
        }
        lastTweetId = tweet.id_str;
      }
      tweets = await getMoreTweets({ max_id: `${BigInt(lastTweetId) - 1n}` });
    }
  } catch (e) {
    console.error(e, JSON.stringify(e, null, 2));
  }
};
