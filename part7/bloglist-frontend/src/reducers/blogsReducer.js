import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updated = action.payload
      return state.map((blog) => (blog.id === updated.id ? updated : blog))
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } =
  blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll()
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
    dispatch(setBlogs(sortedBlogs))
  }
}

export const createNewBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogsService.create(blogObject)
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogsService.change({
      ...blog,
      likes: blog.likes + 1,
    })
    dispatch(updateBlog(updatedBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogsService.remove(id)
    dispatch(removeBlog(id))
  }
}

export const addCommentToBlog = (id, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogsService.addComment(id, comment)
    dispatch(updateBlog(updatedBlog))
  }
}

export default blogsSlice.reducer
