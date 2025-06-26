import { isNotNumber } from "./exerciseCalculator";

const parseArguments = (args: string[]): { height: number; weight: number } => {
  if (args.length < 2) throw new Error('Not enough arguments');
  if (isNotNumber(args[0]) || isNotNumber(args[1])) {
    throw new Error('Provided values were not numbers!');
  }
  return {
    height: Number(args[0]),
    weight: Number(args[1])
  };
};

const calculateBmi = (height: number, weight: number): string => {
  const BMI = weight / ((height / 100) ** 2);
  if (BMI < 18.5) {
    return "underweight";
  } else if (BMI >= 25) {
    return "overweight";
  } else {
    return "Normal range";
  }
};

try {
  const args = process.argv.slice(2);
  const { height, weight } = parseArguments(args);
  console.log(calculateBmi(height, weight));
} catch (e: unknown) {
  if (e instanceof Error) {
    console.log('Error:', e.message);
  }
}