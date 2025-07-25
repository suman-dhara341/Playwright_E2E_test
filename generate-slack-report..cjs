import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read job status from environment variable
const jobStatus = process.env.JOB_STATUS || "unknown";

// Path to Playwright's JSON report
const resultsPath = path.join(__dirname, "test-results", "results.json");

// Initialize summary
let summary = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
};

// Parse JSON report if it exists
if (fs.existsSync(resultsPath)) {
  const raw = fs.readFileSync(resultsPath, "utf-8");
  const results = JSON.parse(raw);

  results.suites.forEach((suite) => {
    suite.specs.forEach((spec) => {
      spec.tests.forEach((test) => {
        summary.total++;
        const result = test.results[0]?.status;
        if (result === "passed") summary.passed++;
        else if (result === "failed") summary.failed++;
        else summary.skipped++;
      });
    });
  });
}

// Format Slack message
const message = `
📣 *Playwright Tests Result:* \`${jobStatus}\`
✅ *Passed:* ${summary.passed}
❌ *Failed:* ${summary.failed}
⏭️ *Skipped:* ${summary.skipped}
🧪 *Workflow:* ${process.env.GITHUB_WORKFLOW}
🔁 *Commit:* ${process.env.GITHUB_SHA?.substring(0, 7)}
📦 *Repo:* ${process.env.GITHUB_REPOSITORY}
🔗 <https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}|View Run Logs>
`.trim();

// Write to slack-summary.txt
fs.writeFileSync(path.join(__dirname, "slack-summary.txt"), message);
console.log("✅ Slack summary written to slack-summary.txt");
