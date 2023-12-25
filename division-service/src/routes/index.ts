import { Router, Request, Response } from "express";
import { divisionOperation } from "../controller/logic";
import Memcached from "memcached";

let memcached = new Memcached("memcached:11211");

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the router!");
});

router.post("/division-service/div", async (req: Request, res: Response) => {
  try {
    const { operands } = req.body;

    if (!operands || !Array.isArray(operands) || operands.length !== 2) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const argOne = Number(operands[0]);
    const argTwo = Number(operands[1]);

    if (argTwo === 0) {
      return res.status(400).json({ error: "Division by zero is not allowed" });
    }

    if (isNaN(argOne) || isNaN(argTwo)) {
      return res.status(400).json({ error: "Operands must be numbers" });
    }

    const operationString = operands.join("/");

    const getCachedCalculation = (key: string): Promise<string | null> => {
      return new Promise((resolve, reject) => {
        memcached.get(key, (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });
    };

    const cachedCalculation = await getCachedCalculation(operationString);

    let result: number;

    if (cachedCalculation) {
      result = Number(cachedCalculation);
    } else {
      result = divisionOperation(argOne, argTwo);
      await new Promise((resolve, reject) => {
        memcached.set(operationString, result.toString(), 0, (err) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    }

    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
