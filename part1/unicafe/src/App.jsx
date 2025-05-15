import { useState } from 'react';

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <p>
      {text}: {value}
    </p>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good - bad) / total;
  const positive = total === 0 ? 0 : (good / total) * 100;

  if (total === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <table>
      <tbody>
        <tr>
          <td><StatisticLine text="good" value={good} /></td>
        </tr>
        <tr>
          <td><StatisticLine text="neutral" value={neutral} /></td>
        </tr>
        <tr>
          <td><StatisticLine text="bad" value={bad} /></td>
        </tr>
        <tr>
          <td><StatisticLine text="all" value={total} /></td>
        </tr>
        <tr>
          <td><StatisticLine text="average" value={average.toFixed(2)} /></td>
        </tr>
        <tr>
          <td><StatisticLine text="positive" value={`${positive.toFixed(2)}%`} /></td>
        </tr>
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />

      <h1>Statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  );
};

export default App;
