import fs from "fs";
import process from "process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const status = process.env.JOB_STATUS || "unknown";
let message = `*📣 Playwright Tests Result:* \`${status}\`\n`;
message += `🧪 *Workflow:* Scheduled Playwright Tests\n`;
message += `🔁 *Commit:* ${process.env.GITHUB_SHA}\n`;
message += `📦 *Repo:* ${process.env.GITHUB_REPOSITORY}\n`;
message += `🔗 <https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}|View Run Logs>\n\n`;

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const resultsPath = `${__dirname}/playwright-report/test-results.json`; // adjust if needed

  const json = fs.readFileSync(resultsPath, "utf8");
  const data = JSON.parse(json);

  const failedTests = [];

  data.suites.forEach((suite) => {
    suite.specs.forEach((spec) => {
      spec.tests.forEach((test) => {
        if (test.status === "failed") {
          failedTests.push(`- ${spec.file}: ${spec.title}`);
        }
      });
    });
  });

  message += failedTests.length
    ? `❌ *Failed Tests:*\n${failedTests.join("\n")}`
    : "✅ All tests passed!";
} catch (err) {
  message += "⚠️ Could not parse test results.";
}

fs.writeFileSync("slack-summary.txt", message);
