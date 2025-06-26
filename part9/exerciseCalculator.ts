interface Results {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const isNotNumber = (argument: any): boolean => isNaN(Number(argument));

const parseArguments = (
  args: string[]
): { target: number; dailyHours: number[] } => {
  if (args.length < 2) throw new Error("Not enough arguments");
  if (isNotNumber(args[0])) throw new Error("Target value is not a number");
  const target = Number(args[0]);
  const dailyHours = args.slice(1).map((h) => {
    if (isNotNumber(h)) throw new Error("Provided values were not numbers!");
    return Number(h);
  });
  return { target, dailyHours };
};

const calculateExercises = (dailyHours: number[], target: number): Results => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((h) => h > 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "great job, target met!";
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "you need to train more";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const args = process.argv.slice(2);
  const { target, dailyHours } = parseArguments(args);
  console.log(calculateExercises(dailyHours, target));
} catch (e: unknown) {
  if (e instanceof Error) {
    console.log("Error:", e.message);
  }
}
