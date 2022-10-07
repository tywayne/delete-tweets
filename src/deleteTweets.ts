import client from "./client";
import utils from "./util";

const getMoreTweets = (options?: object | undefined) => {
  return client.get<TweetOrFavoriteRecord[]>("statuses/user_timeline", {
    user_id: process.env.USERNAME,
    include_rts: true,
    count: 200,
    ...options,
  });
};

const deleteTweet = (tweet: TweetOrFavoriteRecord) => {
  return client.post("statuses/destroy", { id: tweet.id_str });
};

const deleteTweetHandler = async () => {
  try {
    let tweets = await getMoreTweets();

    while (tweets.length) {
      let lastTweetId = "";
      for (let tweet of tweets) {
        const tweetAge =
          utils.now.getTime() -
          new Date(Date.parse(tweet.created_at)).getTime();
        const daysAgo = Math.floor(tweetAge / 60 / 60 / 24 / 1000);

        if (daysAgo >= utils.maxDaysAgo) {
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

export default deleteTweetHandler;
