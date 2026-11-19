import { test, expect } from '@playwright/test';

const statusCodes = [200, 301, 404, 500] as const;

for (const statusCode of statusCodes) {
    test(`GET /status_codes/${statusCode} returns HTTP ${statusCode}`, async ({ request }) => {
        const response = await request.get(`/status_codes/${statusCode}`);
        const body = await response.text();

        expect(response.status()).toBe(statusCode);
        expect(body).toContain(`This page returned a ${statusCode} status code.`);
    });
}
