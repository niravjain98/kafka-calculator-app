export interface MultiplicationOperation {
  (num1: number, num2: number): number;
}

export const multiplicationOperation: MultiplicationOperation = (
  number1,
  number2
) => {
  return number1 * number2;
};
