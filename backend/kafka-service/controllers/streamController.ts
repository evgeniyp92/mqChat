import { Request, Response } from "express";
import kafka from "../lib/kafka";

interface StreamRequest extends Request {
  params: {
    id: string;
  };
  body: {
    data?: string;
  };
}

/**
 * Stream consumer function.
 *
 * @param {StreamRequest} req - The stream request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the stream consumer is done processing.
 */
export const streamConsumer = async (
  req: StreamRequest,
  res: Response,
): Promise<void> => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const consumer = kafka.consumer({ groupId: req.params.id });
  await consumer.connect();
  await consumer.subscribe({ topic: "mqTopic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      res.write(`data: ${message.value?.toString()}\n\n`);
    },
  });

  req.on("close", () => {
    consumer.disconnect();
  });
};

/**
 * Asynchronously produces stream of data to Kafka topic "my-topic".
 *
 * @param {StreamRequest} req - The request object containing the data to be sent.
 * @param {Response} res - The response object to send the status and response to.
 *
 * @returns {Promise<void>} A Promise that resolves when the data is successfully sent or rejects with an error.
 */
export const streamProducer = async (
  req: StreamRequest,
  res: Response,
): Promise<void> => {
  const producer = kafka.producer();
  await producer.connect().catch((e) => console.error(e.message));
  console.log(req.body);
  if (!req.body) {
    res.status(400).json({
      success: false,
      reason: "No data provided in body, or format is incorrect",
    });
  }
  try {
    await producer.send({
      topic: "mqTopic",
      messages: [{ value: JSON.stringify(req.body) }],
    });
    res.status(200).json({ success: true });
  } catch (e) {
    console.error("Error sending data to Kafka:", e);
    res
      .status(500)
      .json({ success: false, reason: "Error sending data to kafka" });
  }
};
