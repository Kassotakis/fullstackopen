import React, { useState, useEffect } from "react";
import axios from "axios";
import { timeStamp } from "console";

interface Diary {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

const App: React.FC = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get<Diary[]>("http://localhost:3000/api/diaries")
      .then((response) => setDiaries(response.data));
  }, []);

  const addDiaryEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    axios
      .post<Diary>("http://localhost:3000/api/diaries", {
        date,
        visibility,
        weather,
        comment,
      })
      .then((response) => {
        setDiaries(diaries.concat(response.data));
        setDate("");
        setVisibility("");
        setWeather("");
        setComment("");
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data);
        } else {
          setError(error.message);
        }
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  };

  return (
    <div>
      <h1>Add New Diary Entry</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={addDiaryEntry}>
        <div>
          <label>
            date:
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </div>

        <fieldset>
          <legend>Visibility:</legend>
          {["great", "good", "ok", "poor"].map((option) => (
            <label key={option}>
              {option}
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={(event) => setVisibility(event.target.value)}
              />
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Weather:</legend>
          {["sunny", "rainy", "cloudy", "stormy", "windy"].map((option) => (
            <label key={option}>
              {option}
              <input
                type="radio"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={(event) => setWeather(event.target.value)}
              />
            </label>
          ))}
        </fieldset>

        <div>
          <label>
            comment:
            <input
              type="text"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
        </div>

        <button type="submit">Add</button>
      </form>

      <h1>Flight Diary</h1>
      <ul>
        {diaries.map((diary) => (
          <li key={diary.id}>
            <strong>{diary.date}</strong> — Weather: {diary.weather},
            Visibility: {diary.visibility}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
