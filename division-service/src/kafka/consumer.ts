import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import axios from "axios";

const kafka = new Kafka({
  clientId: "division-service",
  brokers: ["localhost:9092"],
});

const consumer: Consumer = kafka.consumer({ groupId: "division-group" });

interface KafkaMessage {
  value: Buffer;
  key: Buffer;
  timestamp: string;
}

const processMessage = async (message: KafkaMessage) => {
  const payload = JSON.parse(message.value.toString());
  try {
    const response = await axios.post(
      "http://localhost:3003/api/division-service/add",
      {
        operands: payload.operands,
      }
    );
  } catch (err) {
    console.error("Error calling the API:", err);
  }
};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "division_topic",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      processMessage(message as any);
    },
  });
};

run().catch(console.error);
