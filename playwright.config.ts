import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// ✅ Load .env before using any config that depends on env vars
dotenv.config();

import { EnvConfig } from "./src/config/config";

// ✅ Sanity check
if (!EnvConfig?.userUrl) {
  console.warn("⚠️ WARNING: EnvConfig.userUrl is not defined!");
}

export default defineConfig({
  testDir: "./tests",
  timeout: 80000,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: EnvConfig.userUrl,
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
