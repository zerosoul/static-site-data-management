const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type DDArticle{
   _id: ID!
   title: String!
   description: String!
   content: String!
   link: String!
   date: String!
   thumbnail:String
}

type DDPosition{
   _id: ID!
   title: String!
   cate: String!
   updateTime: String!
   location: String!
   depart:String!
   link: String
}

input DDPositionInput {
  id: String
  title: String!
  cate: String!
  updateTime: String!
  location: String!
  depart:String!
  link: String
}

input DDArticleInput {
  id: String
  title: String!
  description: String!
  content: String!
  link: String!
  date: String!
  thumbnail:String!
}
type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdEvents: [Event!]
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}

input UserInput {
  email: String!
  password: String!
}

type RootQuery {
    events: [Event!]!
    ddArticles: [DDArticle!]!
    getDdArticle(artId: String!): DDArticle
    ddPositions: [DDPosition!]!
    getDdPosition(posId: String!): DDPosition
}
  
type RootMutation {
    login(email: String!, password: String!): AuthData!
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    createDdArticle(dDArticleInput: DDArticleInput): DDArticle
    updateDdArticle(dDArticleInput: DDArticleInput): DDArticle
    removeDdArticle(artId: String!): DDArticle
    createDdPosition(dDPositionInput: DDPositionInput): DDPosition
    updateDdPosition(dDPositionInput: DDPositionInput): DDPosition
    removeDdPosition(posId: String!): DDPosition
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
