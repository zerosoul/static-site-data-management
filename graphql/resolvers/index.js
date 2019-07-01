const authResolver = require("./auth");
const eventsResolver = require("./events");
const ddArticleResolver = require("./ddArticle");
const inviteCodeResolver = require("./inviteCode");
const ddPositionResolver = require("./ddPosition");

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...ddArticleResolver,
  ...inviteCodeResolver,
  ...ddPositionResolver
};

module.exports = rootResolver;
