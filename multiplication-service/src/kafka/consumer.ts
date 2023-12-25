import { Kafka, Consumer, Producer, EachMessagePayload } from "kafkajs";
import axios from "axios";

const kafka = new Kafka({
  clientId: "multiplication-service",
  brokers: ["kafka:29092"],
});

const consumer: Consumer = kafka.consumer({ groupId: "multiplication-group" });
const producer: Producer = kafka.producer();

interface KafkaMessage {
  value: Buffer;
  key: Buffer;
  timestamp: string;
  correlationId: string;
}

const processMessage = async (message: KafkaMessage) => {
  const parsedValue = JSON.parse(message.value.toString());
  const correlationId = parsedValue.correlationId;
  const operands = parsedValue.operands;
  try {
    const response = await axios.post(
      "http://localhost:3003/api/multiplication-service/mul",
      {
        operands: operands,
      }
    );
    console.log(correlationId, operands, "==mul");
    await producer.send({
      topic: "multiplication_response_topic",
      messages: [
        {
          key: Buffer.from(correlationId),
          value: JSON.stringify(response.data),
        },
      ],
    });
    console.log(
      "Sent result to multiplication_response_topic:",
      response.data.result
    );
  } catch (err) {
    console.error("Error calling the API or producing Kafka message:", err);
  }
};

const run = async () => {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({
    topic: "multiplication_topic",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      processMessage(message as any);
    },
  });
};

run().catch(console.error);
