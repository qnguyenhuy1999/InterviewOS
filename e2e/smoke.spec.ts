import path from 'node:path'

import { expect, test } from '@playwright/test'

test('mvp smoke flow', async ({ context, page }) => {
  const email = `smoke-${Date.now()}@example.com`
  const password = 'Password123!'
  const resumePath = path.join(process.cwd(), 'e2e', 'fixtures', 'resume.txt')

  await page.goto('/register')
  await page.locator('#name').fill('Smoke Test')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/\/onboarding/)
  await page.locator('#targetRole').fill('Senior Backend Engineer')
  await page.locator('#techStack').fill('TypeScript, Node.js, PostgreSQL')
  await page.locator('#interviewGoals').fill('System design, communication')
  await page.locator('#preferredOutputStyle').fill('Concise and practical')
  await page.getByRole('button', { name: 'Complete onboarding' }).click()

  await expect(page).toHaveURL(/\/notebook/)

  await context.clearCookies()
  await page.goto('/login')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/dashboard/)

  await page.goto('/notebook/new')
  await page.locator('#title').fill('Redis caching strategies')
  await page.locator('#topic').fill('Caching')
  await page
    .locator('#roughNotes')
    .fill('Tradeoffs between cache-aside and write-through, TTL strategy, invalidation risks.')
  await page.getByRole('button', { name: 'Create note' }).click()
  await expect(page).toHaveURL(/\/notebook\/.+/)

  await page.goto('/interview/start')
  await page.getByRole('button', { name: 'Start interview' }).click()
  await expect(page).toHaveURL(/\/interview\/session\/.+/)

  await page
    .locator('#answer')
    .fill(
      'I would start with cache-aside for simplicity, add TTLs, and protect consistency with explicit invalidation on writes.',
    )
  await page.getByRole('button', { name: 'Submit answer' }).click()
  await expect(page.getByText('Technical feedback')).toBeVisible()

  await page.goto('/review')
  const goodButton = page.getByRole('button', { name: 'GOOD' }).first()
  await expect(goodButton).toBeVisible()
  await goodButton.click()

  await page.goto('/learning-path')
  const learningAction = page.getByRole('button', { name: 'Start' }).first()
  await expect(learningAction).toBeVisible()
  await learningAction.click()

  await page.goto('/resume')
  await page.locator('input[type="file"]').setInputFiles(resumePath)
  await expect(page.getByText('Analysis snapshot')).toBeVisible()
})
