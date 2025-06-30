import { z } from "zod";
import { newPatientSchema } from "../utils/patientUtils";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}

export type PatientToShow = Omit<Patient, "ssn">;

export type NewPatient = z.infer<typeof newPatientSchema>;
