# Playwright Test Configuration

This project has two Playwright configurations:

## Local Development (`playwright.config.ts`)
- Runs all tests
- Higher timeouts for complex UI interactions
- Suitable for local development and debugging

## CI Environment (`playwright.ci.config.ts`)
- Runs only stable, core tests (login test)
- Optimized timeouts for CI
- Uses `testMatch: "**/login.spec.ts"` when `CI=true`

## Usage

### Local Development
```bash
npx playwright test                    # Run all tests
npx playwright test tests/auth/        # Run auth tests only
```

### CI Environment
```bash
CI=true npx playwright test --config=playwright.ci.config.ts
```

## Environment Configuration

The tests automatically detect the environment based on `STAGE_NAME`:
- `local`: Tests against `http://localhost:5173`
- `alpha`: Tests against `https://main.d1vos4qfjhiyoz.amplifyapp.com`
- `prod`: Tests against production environment

## Troubleshooting

If tests fail in CI:
1. Check the environment configuration in `tests/envConfig.ts`
2. Verify the alpha environment is accessible
3. Review test screenshots and videos in `test-results/`

For local development issues:
1. Ensure the dev server is running (`npm run dev`)
2. Check that environment variables are set correctly
3. Use `npx playwright test --headed` for debugging
