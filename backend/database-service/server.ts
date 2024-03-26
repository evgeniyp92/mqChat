import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";
import { MongoClient } from "mongodb";
import Users from "./data-sources/Users";
import { UserModel } from "./models/UsersModel";

const mongoURI = process.env.DB_CONN_STRING;
if (!mongoURI) throw new Error("MongoDB URI is missing");
const client = new MongoClient(mongoURI);
client.connect();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// TODO: Solve issue with top-level await not being suported here
startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => ({
    dataSources: {
      users: new Users({
        modelOrCollection: client.db().collection("users") || UserModel,
      }),
    },
  }),
}).then(({ url }) => {
  console.log("Server running on port " + url);
});
