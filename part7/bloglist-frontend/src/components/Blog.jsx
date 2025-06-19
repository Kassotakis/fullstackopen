import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom'

const Blog = ({ blog, user }) => {
  const isCreator = blog.user?.username === user?.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div className="list-group-item mb-2">
      <div style={blogStyle} className="blog">
        <div className="blog-summary">
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Blog
