const authResolver = require("./auth");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");
const ddArticleResolver = require("./ddArticle");
const ddPositionResolver = require("./ddPosition");

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...ddArticleResolver,
  ...ddPositionResolver
};

module.exports = rootResolver;
