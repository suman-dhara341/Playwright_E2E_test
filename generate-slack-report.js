import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get job status from environment variable
const jobStatus = process.env.JOB_STATUS || "unknown";

// Construct a simple Slack message payload
const slackMessage = {
  text: `📣 *Playwright Tests Result:* \`${jobStatus}\`\n🔗 <https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}|View Run Logs>`,
};

// Save to a JSON file (e.g., for further use by another step or API post)
const outputPath = path.join(__dirname, "slack-report.json");

fs.writeFileSync(outputPath, JSON.stringify(slackMessage, null, 2));

console.log("✅ Slack report generated at:", outputPath);
