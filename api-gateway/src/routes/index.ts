import { Router, Request, Response } from "express";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "api-gateway",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the router!");
});

router.post("/addition-gateway", async (req: Request, res: Response) => {
  try {
    const { operands } = req.body;

    if (!operands || !Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: "Invalid input" });
    }

    await producer.connect();
    await producer.send({
      topic: "addition_topic",
      messages: [{ value: JSON.stringify({ operands }) }],
    });
    res.status(200).json({ message: "Request received, processing..." });
  } catch (error) {
    console.error("Error producing Kafka message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/subtraction-gateway", async (req: Request, res: Response) => {
  try {
    const { operands } = req.body;

    if (!operands || !Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: "Invalid input" });
    }

    await producer.connect();
    await producer.send({
      topic: "subtraction_topic",
      messages: [{ value: JSON.stringify({ operands }) }],
    });

    res.status(200).json({ message: "Request received, processing..." });
  } catch (error) {
    console.error("Error producing Kafka message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/multiplication-gateway", async (req: Request, res: Response) => {
  try {
    const { operands } = req.body;

    if (!operands || !Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: "Invalid input" });
    }

    await producer.connect();
    await producer.send({
      topic: "multiplication_topic",
      messages: [{ value: JSON.stringify({ operands }) }],
    });

    res.status(200).json({ message: "Request received, processing..." });
  } catch (error) {
    console.error("Error producing Kafka message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/division-gateway", async (req: Request, res: Response) => {
  try {
    const { operands } = req.body;

    if (!operands || !Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: "Invalid input" });
    }

    await producer.connect();
    await producer.send({
      topic: "division_topic",
      messages: [{ value: JSON.stringify({ operands }) }],
    });

    res.status(200).json({ message: "Request received, processing..." });
  } catch (error) {
    console.error("Error producing Kafka message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
