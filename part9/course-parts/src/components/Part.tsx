import type { CoursePart } from "../App";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <div>
            <i>{part.description}</i>
          </div>
        </div>
      );
    case "group":
      return (
        <div>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <div>Project exercises: {part.groupProjectCount}</div>
        </div>
      );
    case "background":
      return (
        <div>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <div>
            <i>{part.description}</i>
          </div>
          <div>
            Background material:{" "}
            <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
          </div>
        </div>
      );
    case "special":
      return (
        <div>
          <b>
            {part.name} {part.exerciseCount}
          </b>
          <div>
            <i>{part.description}</i>
          </div>
          <div>Requirements: {part.requirements.join(", ")}</div>
        </div>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
