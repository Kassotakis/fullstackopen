import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove}) => {
  const [visible, setVisible] = useState(false)
  const isCreator = blog.user?.username === user?.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const detailsStyle = {
    display: visible ? '' : 'none'
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }


  return (
    <div style={blogStyle}>
      <div>
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      <div style={detailsStyle}>
        {blog.url}<br />
        likes: {blog.likes} 
        <button onClick={() => handleLike({
          ...blog,
          likes: blog.likes + 1, 
        })}>
          like
        </button>



        <br />
        added by {blog.user?.name || 'unknown'}
        <br />
        {isCreator && (
          <button onClick={() => handleRemove(blog)}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
