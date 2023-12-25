import { Kafka, Consumer, Producer, EachMessagePayload } from "kafkajs";
import axios from "axios";

const kafka = new Kafka({
  clientId: "subtraction-service",
  brokers: ["kafka:29092"],
});

const consumer: Consumer = kafka.consumer({ groupId: "subtraction-group" });
const producer: Producer = kafka.producer();

interface KafkaMessage {
  value: Buffer;
  key: Buffer;
  timestamp: string;
  correlationId: string;
}

const processMessage = async (message: KafkaMessage) => {
  console.log("3");
  const parsedValue = JSON.parse(message.value.toString());
  const correlationId = parsedValue.correlationId;
  const operands = parsedValue.operands;
  try {
    const response = await axios.post(
      "http://localhost:3009/api/subtraction-service/sub",
      {
        operands: operands,
      }
    );
    console.log("4");
    await producer.send({
      topic: "subtraction_response_topic",
      messages: [
        {
          key: Buffer.from(correlationId),
          value: JSON.stringify(response.data),
        },
      ],
    });

    console.log("Sent result to subtraction_response_topic:", response.data);
  } catch (err) {
    console.error("Error calling the API or producing Kafka message:", err);
  }
};

const run = async () => {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: "subtraction_topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      processMessage(message as any);
    },
  });
};

run().catch(console.error);
