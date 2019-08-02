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
  mobile: String
  password: String
  role: Int
  createdAt: String!
}

input UserInput {
  id: String
  name: String
  email: String!
  mobile: String
  password: String!
  role: Int!
}
type UserInfoMeta{
  name: String!
  email: String!
  mobile: String
  role: Int!
}
type AuthData {
  userId: ID!
  meta: UserInfoMeta
  role: Int
  token: String
  tokenExpiration: Int
  errMsg:String
}
type DDArticleResult{
  list:[DDArticle]
  currPage:Int
  pageSize:Int
  total:Int
}
type UserResult{
  list:[User]
  currPage:Int
  pageSize:Int
  total:Int
}
type RootQuery {
    ddArticles(page:Int,limit:Int,title: String,type: String): DDArticleResult
    getDdArticle(artId: String!): DDArticle
    ddPositions: [DDPosition!]!
    getDdPosition(posId: String!): DDPosition
    codes: [InviteCode!]!
    getCode(codeId: String!): InviteCode
    users(page:Int,limit:Int,title: String,role: Int): UserResult
    getUser(uid: String!): User
}
  
type RootMutation {
    login(email: String!, password: String!): AuthData!
    reg(userInput: UserInput): User
    createDdArticle(dDArticleInput: DDArticleInput): DDArticle
    updateDdArticle(dDArticleInput: DDArticleInput): DDArticle
    removeDdArticle(artId: String!): DDArticle
    createDdPosition(dDPositionInput: DDPositionInput): DDPosition
    updateDdPosition(dDPositionInput: DDPositionInput): DDPosition
    removeDdPosition(posId: String!): DDPosition
    removeCode(codeId: String!): InviteCode
    createCode(inviteCodeInput: InviteCodeInput): InviteCode
    updateCode(inviteCodeInput: InviteCodeInput): InviteCode
    removeUser(uid: String!): User
    createUser(userInput: UserInput): User
    updateUser(userInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
