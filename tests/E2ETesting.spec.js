// @ts-check
import { test, expect } from '@playwright/test';

// Main screen
// Bad tests in theory, as it checks for a specific anime. But realisticly works, as they don't change often (if basically at all)
test('Check that the api loads all anime categories in main page', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    let Trending = await page.getByText('Sousou no FrierenTV2023PG-').scrollIntoViewIfNeeded();
    await expect(Trending);
    let action = await page.getByText('Cowboy Bebop').scrollIntoViewIfNeeded();
    await expect(action);
    let comedy = await page.getByText('Hachimitsu to Clover').scrollIntoViewIfNeeded();
    await expect(comedy);
    let fantasy = await page.getByText('Bouken Ou Beet').nth(1).scrollIntoViewIfNeeded();
    await expect(fantasy);
    let slice = await page.getByText('Mahoutsukai ni Taisetsu na').scrollIntoViewIfNeeded();
    await expect(action);
    await page.screenshot({ path: './test-results/Mainpage.png', fullPage: true });
});

test('Check if leaderboard works fine', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.getByRole('button', { name: ' Open the global leaderboard' }).click();
    await expect(page.getByRole('heading', { name: 'Leaderboard' })).toBeVisible();
    await page.getByText('Leaderboard✕#UserTotal').click();
    await page.screenshot({ path: './test-results/Leaderboard.png', fullPage: false });
});

