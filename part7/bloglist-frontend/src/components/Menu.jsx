import { Link } from 'react-router-dom'

const Menu = ({ handleLogout, user }) => {
  const padding = {
    paddingRight: 5,
  }
  return (
    <div>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
      <p></p>
    </div>
  )
}

export default Menu
