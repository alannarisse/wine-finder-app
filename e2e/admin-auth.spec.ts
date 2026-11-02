import { test, expect } from '@playwright/test';
test.use({ channel: 'chrome' });
test('server login persists across refresh, logout revokes, and old browser flags cannot grant access', async ({
  page,
}) => {
  const token = 'b'.repeat(64);
  let active = false;
  await page.route('https://**/*', (route) => route.abort());
  await page.addInitScript(() => sessionStorage.setItem('admin_auth', 'true'));
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    if (path === '/api/auth/login') {
      if (req.postDataJSON().password !== 'test-password')
        return route.fulfill({ status: 401, json: {} });
      active = true;
      return route.fulfill({ json: { token, expiresAt: Date.now() + 3600000 } });
    }
    if (path.startsWith('/api/auth/')) {
      expect(req.headers()['authorization']).toBe(`Bearer ${token}`);
      if (!active) return route.fulfill({ status: 401, json: {} });
      if (path.endsWith('/logout')) active = false;
      return route.fulfill({ json: { expiresAt: Date.now() + 3600000 } });
    }
    return route.fulfill({ json: path.endsWith('/wines') ? [] : {} });
  });
  await page.goto('/admin');
  await expect(page).toHaveURL('/admin/login');
  await page.locator('input[name="password"]').fill('wrong');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Invalid password');
  await page.locator('input[name="password"]').fill('test-password');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page).toHaveURL('/admin');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Wine Admin' })).toBeVisible();
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
  expect(active).toBe(false);
  await page.goto('/admin');
  await expect(page).toHaveURL('/admin/login');
});

test('a server-rejected stored session redirects to login', async ({ page }) => {
  await page.route('https://**/*', (route) => route.abort());
  await page.addInitScript(() =>
    sessionStorage.setItem(
      'wine_admin_session',
      JSON.stringify({ token: 'a'.repeat(64), expiresAt: Date.now() + 3600000 }),
    ),
  );
  await page.route('**/api/auth/session', (route) => route.fulfill({ status: 401, json: {} }));
  await page.goto('/admin');
  await expect(page).toHaveURL('/admin/login');
  expect(await page.evaluate(() => sessionStorage.getItem('wine_admin_session'))).toBeNull();
});
