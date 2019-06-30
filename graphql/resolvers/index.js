const authResolver = require("./auth");
const eventsResolver = require("./events");
const ddArticleResolver = require("./ddArticle");
const ddPositionResolver = require("./ddPosition");

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...ddArticleResolver,
  ...ddPositionResolver
};

module.exports = rootResolver;
