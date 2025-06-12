import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

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

export default anecdoteSlice.reducer