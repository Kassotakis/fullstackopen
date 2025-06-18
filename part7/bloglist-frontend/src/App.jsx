import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
      const sorted = initialBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sorted);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      setUser(user);
      showNotification("Login successful");
      setUsername("");
      setPassword("");
    } catch (error) {
      showNotification("Wrong credentials");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogUser");
    setUser(null);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      showNotification(
        `Added blog "${returnedBlog.title}" by ${returnedBlog.author}`,
      );
      blogFormRef.current.toggleVisibility();
    } catch (error) {
      showNotification("Failed to create blog");
    }
  };

  const handleLike = async (updatedBlog) => {
    try {
      const returnedBlog = await blogService.change(updatedBlog);
      setBlogs(blogs.map((b) => (b.id === returnedBlog.id ? returnedBlog : b)));
    } catch (error) {
      showNotification("Failed to like blog");
    }
  };

  const removeBlog = async (blog) => {
    const confirm = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`,
    );
    if (!confirm) return;

    try {
      await blogService.remove(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
      showNotification(`Deleted blog: ${blog.title}`);
    } catch (error) {
      showNotification("Failed to delete blog");
    }
  };

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
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>

      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleLike={handleLike}
          handleRemove={removeBlog}
        />
      ))}
    </div>
  );
};

export default App;
