import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return null
    },
  },
})

export const { setNotificationMessage, clearNotification } =
  notificationSlice.actions

export const setNotification = (message) => {
  return (dispatch) => {
    dispatch(setNotificationMessage(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }
}

export default notificationSlice.reducer
