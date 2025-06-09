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
        await page.getByTestId('username').fill('Yeezy')
        await page.getByTestId('password').fill('inparis')
        await page.getByRole('button', { name: 'login' }).click()

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
})
