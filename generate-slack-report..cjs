const fs = require("fs");
const path = require("path");

// Read job status from env
const status = process.env.JOB_STATUS || "unknown";

// Read Playwright test results
const resultsPath = path.join(__dirname, "test-results", "results.json");

let summary = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
};

if (fs.existsSync(resultsPath)) {
  const results = JSON.parse(fs.readFileSync(resultsPath, "utf-8"));

  results.suites.forEach((suite) => {
    suite.specs.forEach((spec) => {
      spec.tests.forEach((test) => {
        summary.total++;
        const outcome = test.results[0]?.status;
        if (outcome === "passed") summary.passed++;
        else if (outcome === "failed") summary.failed++;
        else summary.skipped++;
      });
    });
  });
}

const message = `
📣 *Playwright Tests Result:* \`${status}\`
✅ *Passed:* ${summary.passed}
❌ *Failed:* ${summary.failed}
⏭️ *Skipped:* ${summary.skipped}
🧪 *Workflow:* ${process.env.GITHUB_WORKFLOW}
🔁 *Commit:* ${process.env.GITHUB_SHA?.substring(0, 7)}
📦 *Repo:* ${process.env.GITHUB_REPOSITORY}
🔗 <https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${
  process.env.GITHUB_RUN_ID
}|View Run Logs>
`.trim();

// Write to file for Slack
fs.writeFileSync("slack-summary.txt", message);
console.log("✅ Slack summary written to slack-summary.txt");
