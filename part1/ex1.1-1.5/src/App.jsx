const Header = ({ course }) => {
  return (
    <div>
      <h1>{course}</h1>
    </div>
  )
}

const Part1 = ({part1, exercises1}) => {
  return (
    <div>
      <p>
        {part1} {exercises1}
      </p>
    </div>
  )
}

const Part2 = ({part2, exercises2}) => {
  return (
    <div>
      <p>
        {part2} {exercises2}
      </p>
    </div>
  )
}

const Part3 = ({part3, exercises3}) => {
  return (
    <div>
      <p>
        {part3} {exercises3}
      </p>
    </div>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      <Part1 part1={parts[0].name} exercises1={parts[0].exercises}/>
      <Part2 part2={parts[1].name} exercises2={parts[1].exercises}/>
      <Part3 part3={parts[2].name} exercises3={parts[2].exercises}/>
    </div>
  )
}

const Total = ({ parts }) => {
  return (
    <div>
      <p>Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App

