import Twitter from 'twitter-lite';

export default new Twitter({
	consumer_key: process.env.CONSUMER_KEY as string,
	consumer_secret: process.env.CONSUMER_SECRET as string,
	access_token_key: process.env.ACCESS_TOKEN_KEY as string,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET as string,
});
