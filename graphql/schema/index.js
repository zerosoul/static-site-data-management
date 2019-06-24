const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type DDArticle{
   _id: ID!
   title: String!
   description: String!
   link: String!
   date: String!
   thumbnail:String
}

input DDArticleInput {
  id: String
  title: String!
  description: String!
  link: String!
  date: String!
  thumbnail:String!
}

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
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
    bookings: [Booking!]!
    ddArticles: [DDArticle!]!
    getDdArticle(artId: String!): DDArticle
}
  
type RootMutation {
    login(email: String!, password: String!): AuthData!
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
    createDdArticle(dDArticleInput: DDArticleInput): DDArticle
    updateDdArticle(dDArticleInput: DDArticleInput): DDArticle
    removeDdArticle(artId: String!): DDArticle
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
