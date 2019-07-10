const authResolver = require("./auth");
const ddArticleResolver = require("./ddArticle");
const inviteCodeResolver = require("./inviteCode");
const ddPositionResolver = require("./ddPosition");

const rootResolver = {
  ...authResolver,
  ...ddArticleResolver,
  ...inviteCodeResolver,
  ...ddPositionResolver
};

module.exports = rootResolver;
