const authResolver = require("./auth");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");
const ddArticleResolver = require("./ddArticle");

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...ddArticleResolver
};

module.exports = rootResolver;
