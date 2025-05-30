const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')

const Blog = require('../models/blog')

const api = supertest(app)


const initialBlogs = [
{
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  }
]


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
})

// ...

test('correct amount of blogs is returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  // Check the number of blogs returned
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    assert.ok(blog.id, 'Blog is missing id property')
    assert.strictEqual(blog._id, undefined)
  })
})

test('making an HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
  const newBlog = {
    title: "Kanye's Diary",
    author: "Ye",
    url: "https://yezee.com/",
    likes: 5
  }

  // Post the new blog
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Fetch all blogs after POST
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  // Check that the new blog is in the database
  const titles = response.body.map(blog => blog.title)
  assert.ok(titles.includes(newBlog.title))
})

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const newBlog = {
    title: "Kanye's Diary",
    author: "Ye",
    url: "https://yezee.com/",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const addedBlog = response.body.find(blog => blog.title === newBlog.title)
  assert.strictEqual(addedBlog.likes, 0)
})

test('if the title property is missing from the request data, the backend responds to the request with the status code 400 Bad Request.', async () => {
  const newBlog = {
    author: "Ye",
    url: "https://yezee.com/",
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('if the url property is missing from the request data, the backend responds to the request with the status code 400 Bad Request.', async () => {
  const newBlog = {
    title: "Kanye's Diary",
    author: "Ye",
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('deleting a blog works', async () => {
  // Delete a blog by id
  await api
    .delete('/api/blogs/5a422b3a1b54a676234d17f9')
    .expect(204)

  // Fetch all blogs after deletion
  const response = await api.get('/api/blogs')
  // The number of blogs should be one less than initialBlogs
  assert.strictEqual(response.body.length, initialBlogs.length - 1)

  // The deleted blog should not be present anymore
  const ids = response.body.map(blog => blog.id)
  assert.ok(!ids.includes('5a422b3a1b54a676234d17f9'))
})


test('editing a blog works', async () => {
  const updatedBlog = {
    title: "Kanye's Diary",
    author: "Ye",
    url: "https://yezee.com/",
    likes: 5
  }

  // Update the blog
  await api
    .put('/api/blogs/5a422b3a1b54a676234d17f9')
    .send(updatedBlog)
    .expect(200) // Should be 200 OK for a successful update

  // Fetch the updated blog
  const response = await api.get('/api/blogs')
  const blog = response.body.find(b => b.id === '5a422b3a1b54a676234d17f9')

  // Check that the blog's fields are updated
  assert.strictEqual(blog.title, updatedBlog.title)
  assert.strictEqual(blog.author, updatedBlog.author)
  assert.strictEqual(blog.url, updatedBlog.url)
  assert.strictEqual(blog.likes, updatedBlog.likes)
})

after(async () => {
  await mongoose.connection.close()
})
