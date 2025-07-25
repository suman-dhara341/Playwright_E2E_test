const fs = require("fs");

const jobStatus = process.env.JOB_STATUS || "unknown";

// You can add logic to parse results later. For now, a simple message.
let message = `🔍 *Detailed Test Summary:*\n`;

if (jobStatus === "success") {
  message += `✅ All tests passed successfully.`;
} else if (jobStatus === "failure") {
  message += `❌ Some tests failed. Please check the logs.`;
} else {
  message += `⚠️ Job status is: ${jobStatus}`;
}

// Write the message to a file
fs.writeFileSync("slack-summary.txt", message);
