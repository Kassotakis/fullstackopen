import express from "express";
import patients from "../data/patients";
import { PatientToShow } from "../types/patient";

const router = express.Router();

const getPatientsToShow = (): PatientToShow[] => {
  return patients.map(({ ssn, ...patientWithoutSsn }) => patientWithoutSsn);
};

router.get("/", (_req, res) => {
  const patientsToShow = getPatientsToShow();
  res.json(patientsToShow);
});

export default router;
