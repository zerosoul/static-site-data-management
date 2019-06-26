const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(bodyParser.json());

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
// const mdb_conn_str = `mongodb+srv://${process.env.MONGO_USER}:${
//   process.env.MONGO_PASSWORD
// }@cluster-yanggc-v65dk.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`;
const mdb_conn_str = `mongodb://114.242.25.9:27117/test`;
console.info("conn str", mdb_conn_str);
mongoose
  .connect(mdb_conn_str, {
    useNewUrlParser: true
  })
  .then(() => {
    console.info("db connected!");
    app.listen(8001);
  })
  .catch(err => {
    console.log(err);
  });
