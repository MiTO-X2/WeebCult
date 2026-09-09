// @ts-check
import { test, expect } from '@playwright/test';

// Main screen
// Bad tests in theory, as it checks for specific animes. But realisticly works, as they don't change often (if basically at all)
test('Check that the api loads all anime categories in main page', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    let Trending = await page.getByText('Sousou no FrierenTV2023PG-').scrollIntoViewIfNeeded();
    await expect(Trending);
    let action = await page.getByText('Cowboy Bebop', { exact: true }).scrollIntoViewIfNeeded();
    await expect(action);
    let comedy = await page.getByText('Hachimitsu to Clover').scrollIntoViewIfNeeded();
    await expect(comedy);
    let fantasy = await page.getByText('Bouken Ou Beet').nth(1).scrollIntoViewIfNeeded();
    await expect(fantasy);
    let slice = await page.getByText('Mahoutsukai ni Taisetsu na').scrollIntoViewIfNeeded();
    await expect(slice);
    await page.screenshot({ path: './test-results/Mainpage.png', fullPage: true });
});

test('Check if leaderboard works fine', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.getByRole('button', { name: ' Open the global leaderboard' }).click();
    await expect(page.getByRole('heading', { name: 'Leaderboard' })).toBeVisible();
    await page.getByText('Leaderboard✕#UserTotal').click();
    await page.screenshot({ path: './test-results/Leaderboard.png', fullPage: false });
});

test('Check recent quiz menu', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.getByRole('button', { name: ' View your 3 most recent' }).click();
    await expect(page.getByRole('heading', { name: 'Recent Quiz Score' })).toBeVisible();
    await expect(page.getByText('🎉 No quizzes yet! Start your')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Random safe neko' })).toBeVisible();
});

test('Test the searching function', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.getByRole('textbox', { name: 'Search anime...' }).click();
    await page.getByRole('textbox', { name: 'Search anime...' }).fill('Naruto');
    await page.getByRole('banner').getByRole('button').filter({ hasText: /^$/ }).click();
    await expect(page.getByRole('img', { name: 'Naruto', exact: true })).toBeVisible();
});

test('Test out going in a quiz', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.getByRole('img', { name: 'Sousou no Frieren' }).click();
    await page.locator('label').filter({ hasText: 'Name' }).click();
    await page.locator('label').filter({ hasText: 'Name' }).check();
    await page.locator('label').filter({ hasText: 'Solo' }).click();
    await page.locator('label').filter({ hasText: 'Solo' }).check();
    await page.locator('label').filter({ hasText: /^Best10$/ }).click();
    await page.locator('label').filter({ hasText: /^Best10$/ }).check();
    await page.getByRole('button', { name: 'Play' }).click();
    await page.getByRole('heading', { name: 'Who is this character?' }).click();
    await page.getByText('Score: 0').click();
    await page.getByRole('button', { name: 'Cancel' }).click();
});