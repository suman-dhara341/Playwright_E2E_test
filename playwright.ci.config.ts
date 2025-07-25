import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

import { EnvConfigPlaywright } from "./tests/envConfig";

if (!EnvConfigPlaywright?.userUrl) {
  console.warn(
    "⚠️ WARNING: EnvConfig.userUrl is not defined! Did you set STAGE_NAME or .env?"
  );
}

export default defineConfig({
  testDir: "./tests",
  timeout: 60000, // Standard timeout for CI
  retries: 1, // One retry for flaky CI environment
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: EnvConfigPlaywright.userUrl,
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
    actionTimeout: 10000,
    navigationTimeout: 20000,
  },
  workers: 1,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Progressive test coverage for CI reliability
  testMatch: process.env.CI 
    ? (process.env.CI_TEST_LEVEL === "full" 
        ? "**/*.spec.ts" 
        : "**/login.spec.ts")
    : "**/*.spec.ts",
});
