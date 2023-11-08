import mongoose, { Document, Schema } from "mongoose";

interface IOperand {
  operands: string[];
}

interface IOperation extends mongoose.Document {
  operation: string;
  result: number;
}

const operationSchema = new mongoose.Schema<IOperation>({
  operation: String,
  result: Number,
});

const Operation = mongoose.model<IOperation>("Operation", operationSchema);

export default Operation;
