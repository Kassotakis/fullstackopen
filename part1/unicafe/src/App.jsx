import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <button>good</button>
      <button>nautral</button>
      <button>bad</button>

      <h1>Statistics</h1>
      <p>good</p>
      <p>neutral</p>
      <p>bad</p>
      code here
    </div>
  )
}

export default App
