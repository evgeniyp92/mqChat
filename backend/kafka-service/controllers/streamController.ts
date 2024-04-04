import { Request, Response } from "express";
import kafka from "../lib/kafka";

interface StreamRequest extends Request {
  params: {
    id: string;
  };
  body: {
    value?: string;
  };
}

export const streamConsumer = async (req: StreamRequest, res: Response) => {
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

export const streamProducer = async (req: StreamRequest, res: Response) => {
  const producer = kafka.producer();
  await producer.connect().catch((e) => console.error(e.message));
  try {
    await producer.send({
      topic: "my-topic",
      messages: [{ value: JSON.stringify("test") }],
    });
    res.status(200).json({ success: true });
  } catch (e) {
    console.error("Error sending data to Kafka:", e);
    res
      .status(500)
      .json({ success: false, reason: "Error sending data to kafka" });
  }
};
