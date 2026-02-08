import { test, expect, type Page } from '@playwright/test';

const adminEmail = 'admin@farmersea.com';
const adminPassword = 'admin123';

test('admin can log in and reach dashboard', async ({ page }: { page: Page }) => {
  await page.goto('/auth');
  await page.getByRole('tab', { name: 'Sign In' }).click();

  await page.getByLabel('Email').fill(adminEmail);
  await page.getByLabel('Password').fill(adminPassword);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText('Welcome back', { exact: false })).toBeVisible();
});
