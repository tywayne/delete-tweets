import deleteTweetHandler from "./deleteTweets";
import deleteFavoritesHandler from "./deleteFavorites";

const handler = async () => {
  await deleteTweetHandler();
  await deleteFavoritesHandler();
};

export { handler };
