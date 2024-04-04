import "dotenv/config";
import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  brokers: ["upright-boxer-11932-eu2-kafka.upstash.io:9092"],
  ssl: true,
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PW!,
  },
  logLevel: logLevel.ERROR,
});

export default kafka;
