import { Resolvers } from "./__generated__/graphql";

export const resolvers: Resolvers = {
  Query: {
    greetings: () => "GraphQL",
  },

  Mutation: {
    createUser: (_, { username }, { dataSources }) => {
      return dataSources.usersAPI.createUser(username);
    },
  },
};

export default resolvers;
