import { Router, Request, Response } from "express";
import { subtractionOperation } from "../controller/logic";

const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379",
});

client
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err: Error) => {
    console.error("Redis connection error", err);
  });

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the router!");
});

router.post("/subtraction-service/sub", async (req: Request, res: Response) => {
  try {
    const { operands } = req.body;

    if (!operands || !Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const argOne = Number(operands[0]);
    const argTwo = Number(operands[1]);

    if (isNaN(argOne) || isNaN(argTwo)) {
      return res.status(400).json({ error: "Operands must be numbers" });
    }

    const operationString = operands.join("-");
    const cachedCalculation = await client.hGet("subMap", operationString);

    let result;

    if (cachedCalculation) {
      console.log("From cache");
      result = Number(cachedCalculation);
    } else {
      console.log("From logic");
      result = subtractionOperation(argOne, argTwo);
      await client.hSet("subMap", operationString, JSON.stringify(result));
    }
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
