import { Router, Request, Response } from "express";
import { multiplicationOperation } from "../controller/logic";
import { AppDataSource } from "../data-source";
import { Operation } from "../entity/Operation";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the router!");
});

router.post(
  "/multiplication-service/mul",
  async (req: Request, res: Response) => {
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
      let result;

      const operationString = operands.join("*");
      const operation = new Operation();

      const operationRepository = AppDataSource.getRepository(Operation);
      const operation_result = await operationRepository.findOne({
        where: {
          operand: operationString,
        },
      });

      if (operation_result) {
        result = Number(operation_result.result);
      } else {
        result = multiplicationOperation(argOne, argTwo);
        operation.operand = operationString;
        operation.result = result;
        await operationRepository.save(operation);
      }

      res.json({ result });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
