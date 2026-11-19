# Playwright Test

Playwright tests for [The Internet](https://the-internet.herokuapp.com), covering browser-based UI behavior and direct HTTP responses. UI tests run in Chromium, Firefox, and WebKit.

## Test suites

- `tests/ui/` — UI checks for responsive layout, exit intent, and two-factor login.
- `tests/api/` — direct HTTP response checks for the `/status_codes/{code}` endpoints. These endpoints return HTML pages, not JSON or a REST API. Tests use Playwright's `request` fixture and do not open a browser page.

## Running tests

Install dependencies and the browsers once:

```sh
npm ci
npx playwright install chromium firefox webkit
```

Run all configured tests:

```sh
npx playwright test
```

Run a specific suite or spec:

```sh
npx playwright test tests/api
npx playwright test tests/ui
npx playwright test tests/api/status-codes.spec.ts
```

The HTML report is generated in `playwright-report/` after a test run.
