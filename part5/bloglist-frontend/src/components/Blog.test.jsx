import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Test Blog Title',
  author: 'John Doe',
  url: 'http://example.com',
  likes: 42,
  user: { username: 'johndoe', name: 'John' }
}

const user = { username: 'johndoe', name: 'John' }

test('renders title and author but not url or likes by default', () => {
  render(<Blog blog={blog} user={user} />)

  const title_author = screen.getByText('Test Blog Title by John Doe')
  expect(title_author).toBeDefined()

  expect(screen.queryByText('http://example.com')).not.toBeInTheDocument()
  expect(screen.queryByText('42')).not.toBeInTheDocument()
})


test('blog\'s URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
  
  let {container} = render(<Blog blog={blog} user={user} />)

  const userEventInstance = userEvent.setup()
  const viewButton = screen.getByText('view')

  await userEventInstance.click(viewButton)

  const div = container.querySelector('.blog-details')
    expect(div).not.toHaveStyle('display: none')
  
})
