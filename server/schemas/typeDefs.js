//  added:  entire new file and all new code, changed thoughts to books and reomved friends and reactions
// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}
type Auth {
    token: ID!
    user: User
  }

type Query {
    me: User
}
type Mutation {
    loginUser(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String], description: String, title: String, bookId: String!, image: String, link: String): User
    removeBook(bookId: String!): User
}
`;

// export the typeDefs
module.exports = typeDefs;