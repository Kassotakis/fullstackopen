import React, { useEffect, useState } from 'react'
import usersService from '../services/users'
import { Link } from 'react-router-dom'
const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    usersService.getAll().then((data) => setUsers(data))
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
