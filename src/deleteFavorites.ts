import client from './client';
import utils from './util';

const getFavorites = (options?: object | undefined) => {
	return client.get<TweetOrFavoriteRecord[]>('favorites/list', {
		user_id: process.env.USERNAME,
		count: 200,
		entities: false,
		...options,
	});
};

const deleteFavorite = (favorite: TweetOrFavoriteRecord) => {
	return client
		.post('favorites/destroy', { id: favorite.id_str })
		.then(() => {
			console.log(`deleted favorite: ${favorite.id_str} - ${favorite.created_at}`);
		})
		.catch((e) => console.error(e, JSON.stringify(e, null, 2)));
};

const deleteFavoritesHandler = async () => {
	try {
		let favorites = await getFavorites();

		console.log(`Found ${favorites.length} favorites...`);

		while (favorites.length) {
			let lastFavoriteId = '';
			for (let favorite of favorites) {
				const tweetAge = utils.now.getTime() - new Date(Date.parse(favorite.created_at)).getTime();
				const daysAgo = Math.floor(tweetAge / 60 / 60 / 24 / 1000);

				if (daysAgo >= utils.maxDaysAgo) {
					await deleteFavorite(favorite);
				} else {
					console.log(`keep favorite: ${favorite.id_str} - ${favorite.created_at}`);
				}
				lastFavoriteId = favorite.id_str;
			}
			favorites = await getFavorites({
				max_id: `${BigInt(lastFavoriteId) - 1n}`,
			});
		}
	} catch (e) {
		console.error(e, JSON.stringify(e, null, 2));
	}
};

export default deleteFavoritesHandler;
