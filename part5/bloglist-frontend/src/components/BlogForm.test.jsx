import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()

  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')

  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'Kanye')
  await user.type(inputs[1], 'West')
  await user.type(inputs[2], 'IsInTheBuilding')
  await user.click(sendButton)

  expect(createBlog.mock.calls[0][0].title).toBe('Kanye')
    expect(createBlog.mock.calls[0][0].author).toBe('West')
    expect(createBlog.mock.calls[0][0].url).toBe('IsInTheBuilding')
  
})