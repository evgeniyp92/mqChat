import { Resolvers } from "./__generated__/graphql";

export const resolvers: Resolvers = {
  Query: {
    users: (_, __, { dataSources }) => {
      return dataSources.usersAPI.getAllUsers();
    },
    user: (_, { username }, { dataSources }) => {
      return dataSources.usersAPI.findByName(username);
    },
    userById: (_, { id }, { dataSources }) => {
      return dataSources.usersAPI.findById(id);
    },
  },

  Mutation: {
    createUser: (_, { username }, { dataSources }) => {
      return dataSources.usersAPI.createUser(username);
    },
  },
};

export default resolvers;
