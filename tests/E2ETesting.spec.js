// @ts-check
import { test, expect } from '@playwright/test';

// Bad test in theory, as it checks for a specific anime. But realisticly works, as they don't change often (if basically at all)
test('Check for example a trending anime exists', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await expect(page.getByText('Sousou no FrierenTV2023PG-')).toBeVisible();
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
});
