import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import * as mongoose from "mongoose";
import { UsersAPI } from "./datasources/users-api";
import { UserModel } from "./mongomodels/User";

const MONGO_URI = process.env.DB_CONN_STRING;
if (!MONGO_URI) {
  throw new Error("MongoDB URI is missing");
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err.message));

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    return {
      dataSources: {
        usersAPI: new UsersAPI(),
      },
    };
  },
}).then(({ url }) => console.log("Server ready at port ", url));
