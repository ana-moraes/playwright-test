import { test, expect } from '@playwright/test';

test.describe('Two-Factor Login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/two_factor');
        await expect(page.getByRole('heading', { name: 'Two-Factor Login' })).toBeVisible();
    });

    test('rejects invalid username or password', async ({ page }) => {
        await page.getByLabel('Username').fill('tomsmith');
        await page.getByLabel('Password').fill('wrong-password');
        await page.getByRole('button', { name: 'Next' }).click();

        await expect(page.locator('#flash-messages')).toContainText(
            'Your username or password is invalid!'
        );
        await expect(page.getByRole('heading', { name: 'Two-Factor Login' })).toBeVisible();
    });

    test('rejects an invalid one-time code', async ({ page }) => {
        await page.getByLabel('Username').fill('tomsmith');
        await page.getByLabel('Password').fill('SuperSecretPassword!');
        await page.getByRole('button', { name: 'Next' }).click();

        await expect(page.getByRole('heading', { name: 'Enter Your Code' })).toBeVisible();
        const displayedCode = await page.locator('#otp-code').innerText();
        await expect(displayedCode).toMatch(/^\d{6}$/);

        await page.getByLabel('One-time code').fill(displayedCode === '000000' ? '111111' : '000000');
        await page.getByRole('button', { name: 'Verify' }).click();

        await expect(page.locator('#flash-messages')).toContainText('Your code is invalid!');
        await expect(page.getByRole('heading', { name: 'Enter Your Code' })).toBeVisible();
    });

    test('authenticates with valid credentials and one-time code', async ({ page }) => {
        await page.getByLabel('Username').fill('tomsmith');
        await page.getByLabel('Password').fill('SuperSecretPassword!');
        await page.getByRole('button', { name: 'Next' }).click();

        await expect(page.getByRole('heading', { name: 'Enter Your Code' })).toBeVisible();
        const displayedCode = await page.locator('#otp-code').innerText();
        await expect(displayedCode).toMatch(/^\d{6}$/);

        await page.getByLabel('One-time code').fill(displayedCode);
        await page.getByRole('button', { name: 'Verify' }).click();

        await expect(page.getByRole('heading', { name: 'Secure Area' })).toBeVisible();
        await expect(page.locator('#flash-messages')).toContainText(
            'You logged in with two-factor authentication!'
        );

        await page.getByRole('link', { name: 'Logout' }).click();
        await expect(page.getByRole('heading', { name: 'Two-Factor Login' })).toBeVisible();
    });
});
