export interface AdditionOperation {
  (num1: number, num2: number): number;
}

export const additionOperation: AdditionOperation = (number1, number2) => {
  return number1 + number2;
};
