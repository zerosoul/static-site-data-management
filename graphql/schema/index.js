const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type InviteCode{
   _id: ID!
   value: String!
   used: Boolean
   usedBy: User
   role: Int
}

type DDArticle{
   _id: ID!
   title: String!
   description: String!
   content: String
   link: String!
   date: String!
   thumbnail:String
   isTop:Boolean
   type:Int
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

input InviteCodeInput{
  id: String
  value: String!
  used: Boolean
  usedTime: String
  role: Int
}

input DDArticleInput {
  id: String
  title: String
  description: String
  content: String
  link: String
  date: String
  thumbnail:String
  isTop:Boolean
  type:Int
}

type User {
  _id: ID!
  name: String!
  email: String!
  password: String
}

input UserInput {
  name: String
  email: String!
  password: String!
}
type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
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


type RootQuery {
    events: [Event!]!
    ddArticles: [DDArticle!]!
    getDdArticle(artId: String!): DDArticle
    ddPositions: [DDPosition!]!
    codes: [InviteCode!]!
    getCode(codeId: String!): InviteCode
    getDdPosition(posId: String!): DDPosition
}
  
type RootMutation {
    login(email: String!, password: String!): AuthData!
    reg(userInput: UserInput): User
    createEvent(eventInput: EventInput): Event
    createDdArticle(dDArticleInput: DDArticleInput): DDArticle
    updateDdArticle(dDArticleInput: DDArticleInput): DDArticle
    removeDdArticle(artId: String!): DDArticle
    createDdPosition(dDPositionInput: DDPositionInput): DDPosition
    updateDdPosition(dDPositionInput: DDPositionInput): DDPosition
    removeDdPosition(posId: String!): DDPosition
    removeCode(codeId: String!): InviteCode
    createCode(inviteCodeInput: InviteCodeInput): InviteCode
    updateCode(inviteCodeInput: InviteCodeInput): InviteCode
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
