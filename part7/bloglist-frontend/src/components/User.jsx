import React, { useEffect, useState } from 'react'
import usersService from '../services/users'
import { useParams } from 'react-router-dom'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom'

const User = () => {
  const [users, setUsers] = useState([])
  const id = useParams().id

  useEffect(() => {
    usersService.getAll().then((data) => setUsers(data))
  }, [])

  const user = users.find((user) => user.id === id)

  if (!user) {
    return null
  }
  return (
    <div>
      <h2>{user.username}</h2>
      <h4>Added Blogs</h4>

      <ul>
        {user.blogs.map((blog) => (
          <li key={user.id + blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
