const { loginWith, CreateBlog } = require('./helper')

const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Kanye West',
        username: 'Yeezy',
        password: 'inparis'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Username')).toBeVisible()
    await expect(page.getByText('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'Yeezy', 'inparis')

        await expect(page.getByText('Kanye West logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('username').fill('Yeezy')
        await page.getByTestId('password').fill('inlondon')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Wrong Credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    await loginWith(page, 'Yeezy', 'inparis')
    

  })

  test('a new blog can be created', async ({ page }) => {
    await CreateBlog(page, 'Kanye West in Paris', 'Ye', 'https://ye.com')

    await expect(page.getByText('Kanye West in Paris by Ye')).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await CreateBlog(page, 'Kanye West in Paris', 'Ye', 'https://ye.com')


    await page.getByRole('button', { name: 'view' }).click()

    await page.getByRole('button', { name: 'like' }).click()

    await expect(page.getByText('likes: 1')).toBeVisible()
  })


test('a blog can be removed', async ({ page }) => {
    await CreateBlog(page, 'Kanye West in Paris', 'Ye', 'https://ye.com')

    await page.getByRole('button', { name: 'view' }).click()

    page.once('dialog', dialog => dialog.accept())

    await page.getByRole('button', { name: 'remove' }).click()

    

    

    await expect(page.getByText('Kanye West in Paris by Ye')).not.toBeVisible()
    })

    test("only the user who added the blog sees the blog's remove button", async ({ page, request }) => {
    // User A adds a blog
    await CreateBlog(page, 'Kanye West in Paris', 'Ye', 'https://ye.com')
    await page.getByRole('button', { name: 'logout' }).click()

    // Create a second user
    await request.post('http://localhost:3003/api/users', {
        data: {
        name: 'Jay-Z',
        username: 'Beyonce',
        password: 'inparis'
        }
    })

    // Login as second user
    await loginWith(page, 'Beyonce', 'inparis')

    await page.getByRole('button', { name: 'view' }).click()

    const removeButtons = await page.getByRole('button', { name: 'remove' }).all()
    expect(removeButtons.length).toBe(0)
    })

    test('blogs are arranged in descending order according to likes', async ({ page }) => {

        await CreateBlog(page, 'Kanye West in Paris', 'Ye', 'https://ye.com')

        let blogs = await page.locator('.blog').all()
        await blogs[0].getByRole('button', { name: 'view' }).click()
        await blogs[0].getByRole('button', { name: 'like' }).click()

        await CreateBlog(page, 'Jay-Z in Paris', 'Jay-Z', 'https://jayz.com')

        blogs = await page.locator('.blog').all()

        await expect(blogs[0]).toContainText('Kanye West in Paris')
        await expect(blogs[1]).toContainText('Jay-Z in Paris')

        await blogs[1].getByRole('button', { name: 'view' }).click()
        await blogs[1].getByRole('button', { name: 'like' }).click()
        await blogs[1].getByRole('button', { name: 'like' }).click()

        const updatedBlogs = await page.locator('.blog').all()

        await expect(updatedBlogs[0]).toContainText('Jay-Z in Paris')
        await expect(updatedBlogs[1]).toContainText('Kanye West in Paris')
        })



})
})
