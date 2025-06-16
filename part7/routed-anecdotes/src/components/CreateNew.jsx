import {
 useNavigate
} from 'react-router-dom'
import { useState } from 'react'
import  { useField } from '../hooks'


const CreateNew = (props) => {
  const navigate = useNavigate()

    const { reset: resetContent, ...content } = useField('text')
    const { reset: resetAuthor, ...author } = useField('text')
    const { reset: resetInfo, ...info } = useField('text')


  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
        content: content.value,
        author: author.value,
        info: info.value,
        votes: 0
    })
  props.setNotification(`a new anecdote ${content.value} is created`)
  setTimeout(() => {
    props.setNotification('')
  }, 5000)
  navigate('/')
  }

  const handleReset = () => {
    resetContent()
    resetAuthor()
    resetInfo()

  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type='submit' >create</button>
        
      </form>
      <button onClick={handleReset}>reset</button>
    </div>
  )

}

export default CreateNew