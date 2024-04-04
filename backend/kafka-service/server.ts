console.log("Hello from the Kafka service");
// TODO: Write this

import "dotenv/config";
import { EventEmitter } from "node:events";
import express from "express";
import { createServer } from "node:http";
import { streamHandler } from "./controllers/streamController";

const emitter = new EventEmitter();
emitter.emit("abcd", "Hello from the Kafka service thru an emitter");

const app = express();
const server = createServer(app);

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.get("/stream/:id", streamHandler);

// set up socket.io to handle connection events by console logging the fact a client connected and listening for
// event of type 'message' from the frontend
// io.on("connection", (socket) => {
//   console.log("Client connected");
//   socket.on("post message", async (data) => {
//     await producer.connect();
//     await producer.send({
//       topic: "chat",
//       messages: [{ key: data.username, value: data.message }],
//     });
//     await producer.disconnect();
//     // Forward the message to everyone with a connection
//     io.emit("post message", data);
//   });
// });

/*
 * Proposed data flow:
 * Init a consumer with a random clientId -- will this actually make random clientId's for each user?
 * ^^^ For this, I should define a route with a dynamic param that is tied to the user's id in mongo and have the
 * socket, consumer and producer sit there.
 * Use the user id to make unique consumer group per user connected
 *
 * User posts a message from client -- socket-ngx sends it from client and socket.io on node receives it
 *
 * Socket.io on node creates a producer and posts it to the kafka stream
 *
 * Consumer will be listening for new kafka messages, use consumer.run({eachMessage: () => {}})
 *
 * For each message, have socket.io emit an event to all clients with the message
 *
 * Handle new message receipt on frontend with socket-ngx, display and store in local storage
 * ^^^ Committed offsets should mean there is no need to dedupe
 * */

server.listen(4500, () => {
  console.log("Server running at http://localhost:4500");
});
