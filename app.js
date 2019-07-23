const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(bodyParser.json({ limit: "4mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);
let db_conn_str = "";
let account = {};
if (process.env.NODE_ENV === "production") {
  db_conn_str = `mongodb://114.242.25.9:27117/test`;
} else {
  db_conn_str = `mongodb://${process.env.MONGO_HOST}:${
    process.env.MONGO_PORT
  }/${process.env.MONGO_DB}?authSource=admin`;
  account.user = process.env.MONGO_USER;
  account.pass = process.env.MONGO_PASSWORD;
}

console.info("conn str", db_conn_str);
mongoose
  .connect(db_conn_str, {
    useNewUrlParser: true,
    ...account
  })
  .then(() => {
    console.info("db connected!");
    app.listen(8001);
  })
  .catch(err => {
    console.log(err);
  });
