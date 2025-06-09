const LoginForm = ({ username, password, handleUsernameChange, handlePasswordChange, handleLogin, notification }) => {
  return (
    <div>
      <h2>Log in to application</h2>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            data-testid="username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            data-testid="password"
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
