import React from 'react'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Blog from './Blog'

const BlogListView = ({
  blogFormRef,
  addBlog,
  blogs,
  user,
  handleLike,
  handleDelete,
}) => (
  <div className="container mt-4">
    <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
    <div className="list-group mt-4">
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleLike={handleLike}
          handleRemove={handleDelete}
        />
      ))}
    </div>
  </div>
)

export default BlogListView
