import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer' // Correct import of 'vote'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const handleVote = (anecdote) => {
    dispatch(vote(anecdote))
    dispatch(setNotification(`you voted for '${anecdote.content}'`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList