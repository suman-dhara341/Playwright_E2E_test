const fs = require("fs");

const resultsPath = "./test-results/results.json";
const outputPath = "./slack-summary.txt";

if (!fs.existsSync(resultsPath)) {
  fs.writeFileSync(outputPath, "⚠️ No test results found.");
  process.exit(0);
}

const results = JSON.parse(fs.readFileSync(resultsPath, "utf-8"));

const passed = results.suites.flatMap(suite => suite.specs)
  .filter(spec => spec.ok).length;

const failedSpecs = results.suites.flatMap(suite => suite.specs)
  .filter(spec => !spec.ok)
  .map(spec => `❌ ${spec.file}`);

const summary = [
  `📋 Total Tests: ${results.suites.flatMap(s => s.specs).length}`,
  `✅ Passed: ${passed}`,
  `❌ Failed: ${failedSpecs.length}`,
  "",
  failedSpecs.length > 0 ? "*Failed Test Files:*" : "",
  ...failedSpecs,
];

fs.writeFileSync(outputPath, summary.join("\n"));
