import { Request, Response } from "express";
import kafka from "../lib/kafka";

interface StreamRequest extends Request {
  params: {
    id: string;
  };
}

export const streamHandler = async (req: StreamRequest, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const consumer = kafka.consumer({ groupId: req.params.id });
  await consumer.connect();
  await consumer.subscribe({ topic: "test", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      res.write(`data: ${message.value?.toString()}\n\n`);
    },
  });

  req.on("close", () => {
    consumer.disconnect();
  });
};
