import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);
  const bmi = calculateBmi(heightNum, weightNum);

  return res.json({
    weight: weightNum,
    height: heightNum,
    bmi,
  });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = req.body;

  if (!body.daily_exercises || !body.target) {
    return res.status(400).json({ error: "parameters missing" });
  }

  if (
    !Array.isArray(body.daily_exercises) ||
    isNaN(Number(body.target)) ||
    body.daily_exercises.some((h: any) => isNaN(Number(h)))
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const daily_exercises = body.daily_exercises.map((h: any) => Number(h));
  const target = Number(body.target);

  const result = calculateExercises(daily_exercises, target);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
