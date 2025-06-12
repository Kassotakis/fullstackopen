import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'


const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleCreateAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.newNote.value
    dispatch(addAnecdote(content))
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