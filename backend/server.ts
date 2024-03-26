import express from "express";

// GraphQL related imports
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql/utilities";
// @ts-expect-error: This is the documented way of importing ruru even though TS doesn't like it
import { ruruHTML } from "ruru/server";

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

// instance the express server
const app = express();
// instance the http server wrapper
const server = http.createServer(app);
// instance the socket.io wrapper
const io = new Server(server);

// Create and use the GraphQL handler
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);

// Serve graphiQL
app.get("/gql", (req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

io.on("connection", (socket) => {
  console.log("Socket connected");
});

server.listen(4000, () => {
  console.log("Listening on port 4000");
});
