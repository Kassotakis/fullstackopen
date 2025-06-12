import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes' 
import { setNotification } from './notificationReducer' 

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload.id
      const anecdoteToChange = state.find(n => n.id === id)
      if (anecdoteToChange) {
        anecdoteToChange.votes++ 
      }
    },
    createAnecdote(state, action) {
      state.push(action.payload)

    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { vote, createAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll() 
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
    dispatch(setNotification(`you created '${newAnecdote.content}'`, 5))
  
  }
}

export const updateVote = (id) => { 
  return async (dispatch, getState) => {
    const state = getState() 
    const anecdoteToChange = state.anecdotes.find(a => a.id === id)

    if (anecdoteToChange) {
      const updatedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }
      
      const returnedAnecdote = await anecdoteService.update(id, updatedAnecdote)    
     
      dispatch(vote({ id: returnedAnecdote.id }))

      dispatch(setNotification(`you voted '${returnedAnecdote.content}'`, 5))
    }
  }
}

    

export default anecdoteSlice.reducer