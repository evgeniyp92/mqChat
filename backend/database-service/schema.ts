import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    greetings: String
    users: [User!]!
    user(username: String!): User
    userById(id: String!): User
  }

  type Mutation {
    createUser(username: String!): User
  }

  type User {
    id: ID!
    username: String!
  }
`;

export default typeDefs;
