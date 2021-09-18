const client = require("./client.js");
const utils = require("./util.js");

const getFavorites = (options) => {
  return client.get("favorites/list", {
    user_id: process.env.USERNAME,
    count: 200,
    entities: false,
    ...options,
  });
};

const deleteFavorite = (favorite) => {
  return client
    .post("favorites/destroy", { id: favorite.id_str })
    .then(() => {
      console.log(
        `deleted favorite: ${favorite.id_str} - ${favorite.created_at}`
      );
    })
    .catch((e) => console.error(e, JSON.stringify(e, null, 2)));
};

const deleteFavoritesHandler = async (event, context) => {
  try {
    let favorites = await getFavorites();

    console.log(`Found ${favorites.length} favorites...`);

    while (favorites.length) {
      let lastFavoriteId;
      for (let favorite of favorites) {
        const tweetAge = utils.now - new Date(Date.parse(favorite.created_at));
        const daysAgo = Math.floor(tweetAge / 60 / 60 / 24 / 1000);

        if (daysAgo >= utils.maxDaysAgo) {
          console.log(
            `delete favorite: ${favorite.id_str} - ${favorite.created_at}`
          );
          await deleteFavorite(favorite);
        } else {
          console.log(
            `keep favorite: ${favorite.id_str} - ${favorite.created_at}`
          );
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

module.exports = deleteFavoritesHandler;
