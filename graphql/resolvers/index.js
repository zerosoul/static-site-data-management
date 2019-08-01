const authResolver = require("./auth");
const ddArticleResolver = require("./ddArticle");
const inviteCodeResolver = require("./inviteCode");
const userResolver = require("./user");
const ddPositionResolver = require("./ddPosition");

const rootResolver = {
  ...authResolver,
  ...ddArticleResolver,
  ...inviteCodeResolver,
  ...ddPositionResolver,
  ...userResolver
};

module.exports = rootResolver;
