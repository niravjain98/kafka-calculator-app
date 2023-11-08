export interface DivisionOperation {
  (num1: number, num2: number): number;
}

export const divisionOperation: DivisionOperation = (number1, number2) => {
  return number1 / number2;
};
