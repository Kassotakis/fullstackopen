const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const user = new User({ username: 'root', name: 'Superuser', passwordHash: 'secret' })
  await user.save()
})

describe('when creating a new user', () => {
  test('fails if username is missing', async () => {
    const newUser = { name: 'NoUsername', password: 'password123' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('username and password are required')
  })

  test('fails if password is missing', async () => {
    const newUser = { username: 'nouser', name: 'NoPassword' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('username and password are required')
  })

  test('fails if username is too short', async () => {
    const newUser = { username: 'ab', name: 'ShortUser', password: 'password123' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('at least 3 characters long')
  })

  test('fails if password is too short', async () => {
    const newUser = { username: 'validuser', name: 'ShortPass', password: 'pw' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('at least 3 characters long')
  })

  test('fails if username is not unique', async () => {
    const newUser = { username: 'root', name: 'Duplicate', password: 'password123' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('username must be unique')
  })

  test('does not add invalid users to the database', async () => {
    const usersAtStart = await User.find({})
    const newUser = { username: 'ab', name: 'ShortUser', password: 'pw' }
    await api.post('/api/users').send(newUser).expect(400)
    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})