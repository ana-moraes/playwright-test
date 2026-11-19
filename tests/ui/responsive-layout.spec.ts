import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/responsive');
        await expect(page.locator('h3').first()).toHaveText('Responsive Layout');
    });

    test('wide screen layout', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
        await expect(page.locator('#menu-toggle')).toBeHidden();
        await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
        await expect.poll(() =>
            page.locator('#cards').evaluate(
                element => getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length
            )
        ).toBe(3);
    });
    test('mobile screen layout', async ({ page }) => {
        await page.setViewportSize({ width: 400, height: 800 });
        await expect(page.locator('#menu-toggle')).toBeVisible();
        await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'false');
        await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeHidden();
        await expect.poll(() =>
            page.locator('#cards').evaluate(
                element => getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length
            )
        ).toBe(1);
        await page.locator('#menu-toggle').click();
        await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'true');
        await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    });
});