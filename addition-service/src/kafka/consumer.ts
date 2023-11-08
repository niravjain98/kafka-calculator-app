import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import axios from "axios";

const kafka = new Kafka({
  clientId: "addition-service",
  brokers: ["localhost:9092"],
});

const consumer: Consumer = kafka.consumer({ groupId: "artithmetic-group" });

interface KafkaMessage {
  value: Buffer;
  key: Buffer;
  timestamp: string;
}

const processMessage = async (message: KafkaMessage) => {
  const payload = JSON.parse(message.value.toString());
  console.log("payload", payload);
  try {
    const response = await axios.post(
      "http://localhost:3000/api/addition-service/add",
      {
        operands: payload.operands,
      }
    );
    console.log("Result:", response.data);
  } catch (err) {
    console.error("Error calling the API:", err);
  }
};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "addition_topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      processMessage(message as any);
    },
  });
};

run().catch(console.error);
