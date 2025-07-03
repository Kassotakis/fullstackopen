import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

interface Diary {
  id: string;
  date: string;
  weather: string;
  visibility: string;
}

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  useEffect(() => {
    axios
      .get<Diary[]>("http://localhost:3000/api/diaries")
      .then((response) => setDiaries(response.data));
  }, []);
  return (
    <div>
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
