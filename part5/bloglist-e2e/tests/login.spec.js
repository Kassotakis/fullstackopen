const { loginWith } = require('./helper')

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

        await expect(page.getByText('Login Successful')).toBeVisible()
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
    await page.getByRole('button', { name: 'Create new blog' }).click()
    await page.getByLabel('title:').fill('Kanye West in Paris')
    await page.getByLabel('author:').fill('Ye')
    await page.getByLabel('url:').fill('Yessir')
    await page.getByRole('button', { name: 'create' }).click()

    await expect(page.getByText('Added blog "Kanye West in Paris" by Ye')).toBeVisible()
    await expect(page.getByText('Kanye West in Paris by Ye')).toBeVisible()
  })
})
})
