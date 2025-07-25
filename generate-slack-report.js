const fs = require("fs");

try {
  const json = fs.readFileSync("test-results/results.json", "utf8");
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

  const message = failedTests.length
    ? `❌ *Failed Tests:*\n${failedTests.join("\n")}`
    : "✅ All tests passed!";

  fs.writeFileSync("slack-summary.txt", message);
} catch (err) {
  console.error("Failed to generate Slack summary:", err);
  fs.writeFileSync("slack-summary.txt", "⚠️ Could not parse test results.");
}
