import express, { Express, Request, Response } from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql/utilities";
// @ts-expect-error: This is the documented way of importing ruru
import { ruruHTML } from "ruru/server";

// Construct schema
// TODO: Actually write out schema
// TODO: No language support -- Maybe convert to schema.graphql?
const schema = buildSchema(`
    type Query {
        hello: String
    }
`);

// Placeholder resolver function for each api endpoint
const root = {
  hello: () => "Hello World!",
};

const app = express();

// Create and use the GraphQL handler
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);

// Serve graphiQL
app.get("/", (req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(4000);
console.log("Server running on port 4000");
