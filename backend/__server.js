// @ts-nocheck
import express from "express";
// GraphQL related imports
import { buildSchema } from "graphql/utilities";
import { postgraphile } from "postgraphile";
// Socket.io related imports
import * as http from "http";
import { Server } from "socket.io";
// Construct schema
// TODO: Actually write out schema
// TODO: No language support -- Maybe convert to schema.graphql?
const schema = buildSchema(`
    type Query {
        hello: String
    }
`);
// Placeholder GraphQL resolver function for each api endpoint
const root = {
    hello: () => "Hello World!",
};
// instance the express __server
const app = express();
// instance the http __server wrapper
const __server = http.createServer(app);
// instance the socket.io wrapper
const io = new Server(__server);
// configure postgraphile middleware
const postgraphileOptions = {
    subscriptions: true,
    watchPg: true,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    ignoreRBAC: false,
    showErrorStack: "json",
    extendedErrors: ["hint", "detail", "errcode"],
    // appendPlugins: [require("@graphile-contrib/pg-simplify-inflector")],
    exportGqlSchemaPath: "schema.graphql",
    graphiql: true,
    enhanceGraphiql: true,
    // allowExplain(req) {
    //   // TODO: customise condition!
    //   return true;
    // },
    enableQueryBatching: true,
    legacyRelations: "omit",
    // pgSettings(req) {
    //   /* TODO */
    // },
};
app.use(postgraphile("postgres://postgres:password@localhost:5432", 
// schema here refers to sql schemas available in the database
"public", postgraphileOptions));
app.get("/", (req, res) => {
    res.end("Hello World!");
});
app.get("/hello", (req, res) => {
    res.end("Hello");
});
io.on("connection", (socket) => {
    console.log("Socket connected");
});
__server.listen(4000, () => {
    console.log("Listening on port 4000");
});
