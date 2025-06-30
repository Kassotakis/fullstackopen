import { NewPatient, Gender } from "../types/patient";

/** Parse and check that a value is a string */
const parseString = (value: unknown, field: string): string => {
  if (!value || typeof value !== "string") {
    throw new Error(`Invalid or missing ${field}`);
  }
  return value;
};

/** Check that the string is a valid date */
const parseDate = (date: unknown): string => {
  if (!date || typeof date !== "string" || isNaN(Date.parse(date))) {
    throw new Error(`Invalid or missing dateOfBirth: ${date}`);
  }
  return date;
};

/** Check that value is a valid Gender enum */
const parseGender = (value: unknown): Gender => {
  if (
    !value ||
    typeof value !== "string" ||
    !Object.values(Gender).includes(value as Gender)
  ) {
    throw new Error(`Invalid or missing gender: ${value}`);
  }
  return value as Gender;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Invalid or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newPatient: NewPatient = {
      name: parseString(object.name, "name"),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseString(object.ssn, "ssn"),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation, "occupation"),
    };

    return newPatient;
  }

  throw new Error("Some fields are missing");
};
