import { Router, Request, Response } from "express";
import { Kafka, Producer, Consumer } from "kafkajs";
import { v4 as uuidv4 } from "uuid";

const events = require("events");
const eventEmitter = new events.EventEmitter();

const kafka = new Kafka({
  clientId: "api-gateway",
  brokers: ["localhost:29092"],
});

const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId: "api-gateway-group" });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "addition_response_topic",
    fromBeginning: true,
  });
  await consumer.subscribe({
    topic: "subtraction_response_topic",
    fromBeginning: true,
  });
  await consumer.subscribe({
    topic: "multiplication_response_topic",
    fromBeginning: true,
  });
  await consumer.subscribe({
    topic: "division_response_topic",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const responseCorrelationId = message.key!.toString();
      const response = JSON.parse(message.value!.toString());
      eventEmitter.emit(responseCorrelationId, response.result);
      console.log(responseCorrelationId, response, "====");
    },
  });
};

runConsumer().catch(console.error);

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the router!");
});

router.post("/addition-gateway", async (req: Request, res: Response) => {
  try {
    const { operands } = req.body;
    const correlationId = uuidv4();

    if (!operands || !Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: "Invalid input" });
    }

    await producer.connect();
    await producer.send({
      topic: "addition_topic",
      messages: [{ value: JSON.stringify({ correlationId, operands }) }],
    });

    eventEmitter.once(correlationId, (response: string) => {
      res.status(200).json({ result: response });
    });

    setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({ error: "Timeout waiting for response" });
        eventEmitter.removeAllListeners(correlationId);
      }
    }, 30000);
  } catch (error) {
    console.error("Error producing Kafka message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/subtraction-gateway", async (req: Request, res: Response) => {
  try {
    const { operands } = req.body;
    const correlationId = uuidv4();

    if (!operands || !Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: "Invalid input" });
    }

    await producer.connect();
    await producer.send({
      topic: "subtraction_topic",
      messages: [{ value: JSON.stringify({ correlationId, operands }) }],
    });
    eventEmitter.once(correlationId, (response: string) => {
      res.status(200).json({ result: response });
    });

    setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({ error: "Timeout waiting for response" });
        eventEmitter.removeAllListeners(correlationId);
      }
    }, 30000);
  } catch (error) {
    console.error("Error producing Kafka message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/multiplication-gateway", async (req: Request, res: Response) => {
  try {
    const { operands } = req.body;
    const correlationId = uuidv4();

    if (!operands || !Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: "Invalid input" });
    }

    await producer.connect();
    await producer.send({
      topic: "multiplication_topic",
      messages: [{ value: JSON.stringify({ correlationId, operands }) }],
    });

    eventEmitter.once(correlationId, (response: string) => {
      res.status(200).json({ result: response });
    });

    setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({ error: "Timeout waiting for response" });
        eventEmitter.removeAllListeners(correlationId);
      }
    }, 30000);
  } catch (error) {
    console.error("Error producing Kafka message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/division-gateway", async (req: Request, res: Response) => {
  try {
    const { operands } = req.body;
    const correlationId = uuidv4();

    if (!operands || !Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: "Invalid input" });
    }

    await producer.connect();
    await producer.send({
      topic: "division_topic",
      messages: [{ value: JSON.stringify({ correlationId, operands }) }],
    });

    eventEmitter.once(correlationId, (response: string) => {
      res.status(200).json({ result: response });
    });

    setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({ error: "Timeout waiting for response" });
        eventEmitter.removeAllListeners(correlationId);
      }
    }, 30000);
  } catch (error) {
    console.error("Error producing Kafka message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
