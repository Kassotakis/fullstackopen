const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')

const Blog = require('../models/blog')
const User = require('../models/user')

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

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Create a user
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpass'
  }
  await api.post('/api/users').send(newUser)

  // Log in to get token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
  token = `Bearer ${loginResponse.body.token}`

  const user = await User.findOne({ username: newUser.username })
  for (let blog of initialBlogs) {
    let blogObject = new Blog({ ...blog, user: user._id })
    await blogObject.save()
    user.blogs = user.blogs.concat(blogObject._id)
    await user.save()
  }
})

test('correct amount of blogs is returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

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

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', token)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
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
    .set('Authorization', token)
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
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', token)
    .expect(400)
})

test('if the url property is missing from the request data, the backend responds to the request with the status code 400 Bad Request.', async () => {
  const newBlog = {
    title: "Kanye's Diary",
    author: "Ye",
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', token)
    .expect(400)
})

test('adding a blog fails with 401 Unauthorized if token is not provided', async () => {
  const newBlog = {
    title: "Unauthorized Blog",
    author: "No Token",
    url: "https://notoken.com/",
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('deleting a blog works', async () => {
  await api
    .delete('/api/blogs/5a422b3a1b54a676234d17f9')
    .set('Authorization', token)
    .expect(204)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length - 1)
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

  await api
    .put('/api/blogs/5a422b3a1b54a676234d17f9')
    .send(updatedBlog)
    .expect(200)

  const response = await api.get('/api/blogs')
  const blog = response.body.find(b => b.id === '5a422b3a1b54a676234d17f9')
  assert.strictEqual(blog.title, updatedBlog.title)
  assert.strictEqual(blog.author, updatedBlog.author)
  assert.strictEqual(blog.url, updatedBlog.url)
  assert.strictEqual(blog.likes, updatedBlog.likes)
})

after(async () => {
  await mongoose.connection.close()
})
