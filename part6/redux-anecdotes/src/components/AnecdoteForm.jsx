import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleCreateAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.newNote.value
    dispatch(createAnecdote(content))
    event.target.newNote.value = ''
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateAnecdote}>
        <div><input name='newNote'/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm