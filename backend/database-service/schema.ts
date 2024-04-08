import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(username: String!): User
    userById(id: String!): User
  }

  type Mutation {
    createUser(username: String!, uuid: String!): User
  }

  type User {
    id: ID!
    username: String!
    uuid: String!
  }
`;

export default typeDefs;
