import express from "express";
import patients from "../data/patients";
import {
  PatientToShow,
  Patient,
  Entry,
  EntryWithoutId,
  NewPatient,
} from "../types/patient";

import { v1 as uuid } from "uuid";
import { z } from "zod";
import { newPatientSchema } from "../utils/patientUtils";
import { toNewEntry } from "../utils/patientUtils";

const router = express.Router();

router.get("/", (_req, res) => {
  const patientsToShow: PatientToShow[] = patients.map(
    ({ ssn, ...rest }) => rest
  );
  res.json(patientsToShow);
});

router.get("/:id", (req, res) => {
  const id: string = req.params.id;
  const patient: Patient | undefined = patients.find((p) => p.id === id);

  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send({ error: "Patient not found" });
  }
});

router.post("/", (req, res) => {
  try {
    const newPatient: NewPatient = newPatientSchema.parse(req.body);

    const addedPatient: Patient = {
      id: uuid(),
      ...newPatient,
    };

    patients.push(addedPatient);
    res.status(201).json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: "unknown error" });
    }
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const id = req.params.id;
    const patient = patients.find((p) => p.id === id);

    if (!patient) {
      return res.status(404).send({ error: "Patient not found" });
    }

    const entry: EntryWithoutId = toNewEntry(req.body);

    const newEntry: Entry = {
      id: uuid(),
      ...entry,
    };

    patient.entries.push(newEntry);

    return res.status(201).json(newEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({ error: error.issues });
    } else {
      return res.status(400).send({ error: "unknown error" });
    }
  }
});

export default router;
