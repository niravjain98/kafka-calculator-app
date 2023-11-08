export interface SubtractionOperation {
  (num1: number, num2: number): number;
}

export const subtractionOperation: SubtractionOperation = (
  number1,
  number2
) => {
  return number1 - number2;
};
