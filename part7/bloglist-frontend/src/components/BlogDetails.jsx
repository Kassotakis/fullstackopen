import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addCommentToBlog } from '../reducers/blogsReducer'

const BlogDetails = ({ handleLike, handleDelete, user }) => {
  const { id } = useParams()
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

  if (!blog) {
    return <div className="alert alert-warning">Blog not found</div>
  }

  const isCreator = blog.user?.username === user?.username

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    if (comment.trim() === '') return
    dispatch(addCommentToBlog(blog.id, comment))
    setComment('')
  }

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2 className="card-title">{blog.title}</h2>
        <h6 className="card-subtitle mb-2 text-muted">{blog.author}</h6>
        <p className="card-text">
          URL: <a href={blog.url}>{blog.url}</a>
        </p>
        <p className="card-text">Likes: {blog.likes}</p>
        <button
          onClick={() =>
            handleLike({
              ...blog,
            })
          }
        >
          like
        </button>
        <h5 className="mt-4">Comments</h5>
        <form className="mb-3" onSubmit={handleCommentSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={comment}
              onChange={({ target }) => setComment(target.value)}
              placeholder="Add a comment"
            />
            <button className="btn btn-primary" type="submit">
              Add comment
            </button>
          </div>
        </form>

        {blog.comments && blog.comments.length > 0 ? (
          <ul className="list-group">
            {blog.comments.map((c, idx) => (
              <li className="list-group-item" key={idx}>
                {c}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted">No comments yet.</div>
        )}
      </div>
      {isCreator && <button onClick={() => handleDelete(blog)}>remove</button>}
    </div>
  )
}

export default BlogDetails
