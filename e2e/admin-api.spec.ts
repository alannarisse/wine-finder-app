import { test, expect } from '@playwright/test';

test.use({ channel: 'chrome' });
const wine = {
  id: 42,
  wineName: 'Saved Pinot',
  wineryName: 'Fixture Winery',
  varietal: 'Pinot Noir',
  year: null,
  estimatedPrice: 0,
  wineryCity: 'Dundee',
  wineryState: 'OR',
  wineryAddress: '1 Test Street',
  wineryUrl: 'https://example.com',
  imageUrl: 'https://example.com/wine.jpg',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  description: '',
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem(
      'wine_admin_session',
      JSON.stringify({ token: 'a'.repeat(64), expiresAt: Date.now() + 3600000 }),
    ),
  );
  await page.route('**/api/auth/session', (route) => {
    expect(route.request().headers()['authorization']).toBe(`Bearer ${'a'.repeat(64)}`);
    return route.fulfill({ json: { expiresAt: Date.now() + 3600000 } });
  });
  await page.route('https://**/*', (route) => route.abort());
});

test('admin saves, edits, maps, and deletes API data across page reloads', async ({ page }) => {
  let wines: any[] = [];
  let mappings: Record<string, number[]> = {};
  await page.route(/\/api\/(?!auth\/)/, async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    const method = request.method();
    if (method !== 'GET')
      expect(request.headers()['authorization']).toBe(`Bearer ${'a'.repeat(64)}`);
    let body: unknown = {};
    if (path === '/api/wines' && method === 'GET') body = wines;
    else if (path === '/api/wines' && method === 'POST') {
      expect(request.postDataJSON()).not.toHaveProperty('id');
      wines.push({ ...request.postDataJSON(), id: 42 });
      body = wines[0];
    } else if (path === '/api/wines/42' && method === 'PATCH') {
      wines[0] = { ...wines[0], ...request.postDataJSON() };
      body = wines[0];
    } else if (path === '/api/wines/42' && method === 'DELETE') {
      wines = [];
      mappings = {};
    } else if (path === '/api/varietal-mappings' && method === 'GET') body = mappings;
    else if (path === '/api/varietal-mappings' && method === 'POST') {
      const data = request.postDataJSON();
      mappings[data.varietal] = [data.wineId];
      body = data;
    } else if (method === 'DELETE' && path.startsWith('/api/varietal-mappings/')) mappings = {};
    else throw new Error(`Unexpected API request: ${method} ${path}`);
    await route.fulfill({ json: body });
  });
  await page.goto('/admin');
  await page.getByRole('button', { name: 'Add Wine', exact: true }).click();
  for (const [key, value] of Object.entries(wine)) {
    if (['id', 'year', 'description'].includes(key)) continue;
    await page.locator(`[formControlName="${key}"]`).fill(String(value));
  }
  await page.getByRole('dialog').getByRole('button', { name: 'Add Wine', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload();
  await expect(
    page
      .locator('td')
      .filter({ hasText: /^Saved Pinot$/ })
      .last(),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Edit wine', exact: true }).click();
  await expect(page.locator('[formControlName="estimatedPrice"]')).toHaveValue('0');
  await page.locator('[formControlName="wineName"]').fill('Updated Pinot');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('tab', { name: 'Varietal Mapping' }).click();
  await page.locator('mat-expansion-panel-header').filter({ hasText: 'Pinot Noir' }).click();
  const panel = page.locator('mat-expansion-panel').filter({ hasText: 'Pinot Noir' });
  await panel.getByRole('combobox').click();
  await page.getByRole('option', { name: /Updated Pinot/ }).click();
  await expect(panel.locator('.wine-chip')).toHaveCount(1);
  await page.reload();
  await page.goto('/');
  await page.getByRole('combobox').first().click();
  await page.getByRole('option', { name: 'Fish', exact: true }).click();
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'Rich, oily fish', exact: true }).click();
  await expect(page.locator('.wine-card')).toContainText('Updated Pinot');
  await page.goto('/admin');
  await page.getByRole('tab', { name: 'Varietal Mapping' }).click();
  await page.locator('mat-expansion-panel-header').filter({ hasText: 'Pinot Noir' }).click();
  await panel.locator('.remove-btn').click();
  await expect(panel.locator('.wine-chip')).toHaveCount(0);
  await page.getByRole('tab', { name: 'Wines', exact: true }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete wine', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'Updated Pinot', exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.empty-state')).toBeVisible();
});

test('failed save keeps entered values and allows retry without reporting success', async ({
  page,
}) => {
  let fail = true;
  await page.route(/\/api\/(?!auth\/)/, async (route) => {
    if (route.request().method() === 'PATCH') {
      await route.fulfill(
        fail
          ? { status: 400, json: { message: ['imageUrl must be a URL address'] } }
          : { json: { ...wine, ...route.request().postDataJSON() } },
      );
    } else await route.fulfill({ json: route.request().url().endsWith('/wines') ? [wine] : {} });
  });
  await page.goto('/admin');
  await page.getByRole('button', { name: 'Edit wine', exact: true }).click();
  await page.locator('[formControlName="wineName"]').fill('Keep my edits');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByRole('alert')).toContainText('imageUrl must be a URL address');
  await expect(page.locator('[formControlName="wineName"]')).toHaveValue('Keep my edits');
  await expect(page.getByText('Wine updated successfully')).toHaveCount(0);
  fail = false;
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(
    page.locator('td.mat-column-wineName').filter({ hasText: /^Keep my edits$/ }),
  ).toBeVisible();
});

test('load errors are distinct from empty inventory and can be retried', async ({ page }) => {
  let fail = true;
  await page.route(/\/api\/(?!auth\/)/, (route) =>
    route.fulfill(
      fail
        ? { status: 503, json: {} }
        : { json: route.request().url().endsWith('/wines') ? [] : {} },
    ),
  );
  await page.goto('/admin');
  await expect(page.getByRole('alert')).toContainText('Could not load saved wines');
  await expect(page.getByRole('button', { name: 'Add Wine', exact: true })).toBeDisabled();
  await expect(page.locator('.empty-state')).toHaveCount(0);
  fail = false;
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Add Wine', exact: true })).toBeEnabled();
});

test('failed deletes and mapping writes leave saved UI data intact', async ({ page }) => {
  await page.route(/\/api\/(?!auth\/)/, (route) => {
    if (route.request().method() !== 'GET') return route.fulfill({ status: 503, json: {} });
    return route.fulfill({
      json: route.request().url().endsWith('/wines') ? [wine] : { 'Pinot Noir': [42] },
    });
  });
  await page.goto('/admin');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete wine', exact: true }).click();
  await expect(page.getByText('Could not delete wine. Please retry.')).toBeVisible();
  await expect(page.locator('td.mat-column-wineName')).toHaveText('Saved Pinot');
  await page.getByRole('tab', { name: 'Varietal Mapping' }).click();
  const panel = page.locator('mat-expansion-panel').filter({ hasText: 'Pinot Noir' });
  await panel.locator('mat-expansion-panel-header').click();
  await panel.locator('.remove-btn').click();
  await expect(page.getByText('Could not remove mapping. Please retry.')).toBeVisible();
  await expect(panel.locator('.wine-chip')).toHaveCount(1);
});
