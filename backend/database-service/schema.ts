import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    "try to get the user from the database, if he exists"
    user(username: String!): User
  }

  type Mutation {
    "create a new user"
    createUser(name: String!): User
  }

  type User {
    id: ID!
    username: String
  }
`;
