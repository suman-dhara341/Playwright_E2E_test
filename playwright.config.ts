import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { EnvConfig } from "./src/config/config";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  timeout: 80000,
  retries: 0,
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/results.json" }], // 👈 Add this line
  ],
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
