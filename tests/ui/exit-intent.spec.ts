import { test, expect, type Page } from '@playwright/test';

async function triggerExitIntent(page: Page) {
    await page.mouse.move(100, 100);
    await page.mouse.move(100, -1);
}

test.describe('Exit Intent', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/exit_intent');
        await expect(page.locator('h3').first()).toHaveText('Exit Intent');
    });

    test('modal is hidden until the pointer leaves the viewport', async ({ page }) => {
        await expect(page.locator('#ouibounce-modal')).toBeHidden();
        await expect(page.locator('#page-footer')).toBeVisible();
    });

    test('leaving the viewport opens the modal and the close control dismisses it', async ({ page }) => {
        const modal = page.locator('#ouibounce-modal');

        await triggerExitIntent(page);

        await expect(modal.getByRole('heading', { name: 'This is a modal window' })).toBeVisible();
        await expect(page.locator('#page-footer')).toBeHidden();
        await modal.getByText('Close', { exact: true }).click();
        await expect(modal).toBeHidden();
        await expect(page.locator('#page-footer')).toBeVisible();
    });

    test('clicking outside the modal dismisses it', async ({ page }) => {
        const modal = page.locator('#ouibounce-modal');

        await triggerExitIntent(page);
        await expect(modal).toBeVisible();
        await page.mouse.click(5, 5);
        await expect(modal).toBeHidden();
        await expect(page.locator('#page-footer')).toBeVisible();
    });
});
