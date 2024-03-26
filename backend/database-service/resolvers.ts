import { Resolvers } from "./__generated__/graphql";

export const resolvers: Resolvers = {
  Query: {
    greetings: () => "GraphQL",
  },

  Mutation: {
    createUser: (_, __, { dataSources }) => {
      console.log("I got here");
      return dataSources.usersAPI.createUser("joe");
    },
  },
};

export default resolvers;
