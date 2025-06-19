import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Users from './components/Users'
import User from './components/User'
import Menu from './components/Menu'

import BlogListView from './components/BlogListView'
import BlogDetails from './components/BlogDetails'

import LoginForm from './components/LoginForm'
import { setNotification } from './reducers/notificationReducer'
import {
  createNewBlog,
  initializeBlogs,
  deleteBlog,
  likeBlog,
} from './reducers/blogsReducer'
import { setUser, clearUser } from './reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom'

const App = () => {
  const blogs = useSelector((state) => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector((state) => state.user)
  const notification = useSelector((state) => state.notification)
  const dispatch = useDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
      showNotification('Login successful')
    } catch (error) {
      showNotification('Wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
  }

  const showNotification = (message) => {
    dispatch(setNotification(message))
  }

  const addBlog = async (blogObject) => {
    try {
      await dispatch(createNewBlog(blogObject))
      showNotification(
        `Added blog "${blogObject.title}" by ${blogObject.author}`
      )
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      showNotification('Failed to create blog')
    }
  }

  const handleLike = async (updatedBlog) => {
    try {
      await dispatch(likeBlog(updatedBlog))
    } catch (error) {
      showNotification('Failed to like blog')
    }
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id))
    }
  }

  if (user === null) {
    return (
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleLogin={handleLogin}
        notification={notification}
      />
    )
  }

  return (
    <Router>
      <div className="container">
        <h2>blogs</h2>
        <Notification message={notification} />
        <Menu handleLogout={handleLogout} user={user} />
        <Routes>
          <Route
            path="/"
            element={
              <BlogListView
                blogFormRef={blogFormRef}
                addBlog={addBlog}
                blogs={blogs}
                user={user}
                handleLike={handleLike}
                handleDelete={handleDelete}
              />
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route
            path="blogs/:id"
            element={
              <BlogDetails
                handleLike={handleLike}
                handleDelete={handleDelete}
                user={user}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
