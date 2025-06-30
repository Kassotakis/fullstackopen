import express from "express";
import patients from "../data/patients";
import { PatientToShow, Patient } from "../types/patient";
import { toNewPatient } from "../utils/patientUtils";
import { v1 as uuid } from "uuid";

const router = express.Router();

router.get("/", (_req, res) => {
  const patientsToShow: PatientToShow[] = patients.map(
    ({ ssn, ...rest }) => rest
  );
  res.json(patientsToShow);
});

router.post("/", (req, res) => {
  console.log("Request body:", req.body);

  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient: Patient = {
      id: uuid(),
      ...newPatient,
    };

    patients.push(addedPatient);
    res.status(201).json(addedPatient);
  } catch (e: unknown) {
    let errorMessage = "Something went wrong.";
    if (e instanceof Error) {
      errorMessage += " Error: " + e.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
