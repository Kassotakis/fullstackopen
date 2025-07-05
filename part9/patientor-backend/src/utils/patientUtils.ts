import { Gender } from "../types/patient";
import { HealthCheckRating } from "../types/patient";
import { EntryWithoutId } from "../types/patient";

import { z } from "zod";

const BaseEntry = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HealthCheckEntry = BaseEntry.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const HospitalEntry = BaseEntry.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string(),
    criteria: z.string(),
  }),
});

const OccupationalHealthcareEntry = BaseEntry.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});

const EntrySchema = z.discriminatedUnion("type", [
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
]);

export const toNewEntry = (object: unknown): EntryWithoutId => {
  return EntrySchema.parse(object);
};

export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(EntrySchema),
});
