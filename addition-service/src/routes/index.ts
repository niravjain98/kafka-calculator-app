import { Router, Request, Response } from "express";
import { additionOperation } from "../controller/logic";
import Operation from "../model/schema";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the router!");
});

router.post("/addition-service/add", async (req: Request, res: Response) => {
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

    const operationString = operands.join("+");
    const existingOperation = await Operation.findOne({
      operation: operationString,
    });

    let result;

    if (existingOperation) {
      result = existingOperation.result;
    } else {
      result = additionOperation(argOne, argTwo);
      const newOperation = new Operation({
        operation: operationString,
        result,
      });
      await newOperation.save();
    }
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
