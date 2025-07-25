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
  timeout: 80000,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: EnvConfigPlaywright.userUrl,
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  workers: 1,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
