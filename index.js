const deleteHandler = require("./src/deleteTweets.js");
const deleteFavoritesHandler = require("./src/deleteFavorites.js");

module.exports.handler = async (event, context) => {
  await deleteHandler();
  await deleteFavoritesHandler();
};
