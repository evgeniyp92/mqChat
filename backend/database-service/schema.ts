import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    greetings: String
  }

  type Mutation {
    createUser(username: String!): User
  }

  type User {
    id: ID
    username: String
  }
`;

export default typeDefs;
