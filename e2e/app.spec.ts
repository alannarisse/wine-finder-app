import { test, expect } from '@playwright/test';

test.describe('Wine Finder App', () => {
  test('should display home page with wine pairing selector', async ({ page }) => {
    await page.goto('/');

    // Check for main heading or branding
    await expect(page.locator('app-header')).toBeVisible();

    // Check for wine finder component
    await expect(page.locator('app-wine-finder')).toBeVisible();
  });

  test('should navigate to admin login', async ({ page }) => {
    await page.goto('/admin/login');

    // Check for login form
    await expect(page.locator('input[formControlName="password"]')).toBeVisible();

    // Check for close button
    await expect(page.locator('.close-button')).toBeVisible();
  });

  test('admin login close button navigates to home', async ({ page }) => {
    await page.goto('/admin/login');

    // Click close button
    await page.locator('.close-button').click();

    // Should navigate to home
    await expect(page).toHaveURL('/');
  });

  test('should show error for invalid admin password', async ({ page }) => {
    await page.goto('/admin/login');

    // Enter wrong password
    await page.locator('input[formControlName="password"]').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();

    // Should show error message
    await expect(page.locator('.error-message')).toBeVisible();
  });

  test('should login with correct password and redirect to admin', async ({ page }) => {
    await page.goto('/admin/login');

    // Enter correct password
    await page.locator('input[formControlName="password"]').fill('winelover2024');
    await page.locator('button[type="submit"]').click();

    // Should navigate to admin page
    await expect(page).toHaveURL('/admin');
  });

  test('admin page should be protected', async ({ page }) => {
    // Try to access admin directly without logging in
    await page.goto('/admin');

    // Should redirect to login
    await expect(page).toHaveURL('/admin/login');
  });
});

test.describe('Wine Recommendations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show food categories', async ({ page }) => {
    // Look for food category buttons or selections
    const categories = ['Fish', 'Chicken', 'Beef', 'Pork', 'Lamb', 'Vegetarian', 'Cheese', 'Dessert'];

    for (const category of categories) {
      const categoryElement = page.getByText(category, { exact: false });
      await expect(categoryElement.first()).toBeVisible();
    }
  });
});
