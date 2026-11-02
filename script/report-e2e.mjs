import fs from "node:fs";

const filename = process.argv[2] ?? "test-results/results.json";
const report = JSON.parse(fs.readFileSync(filename, "utf8"));
const { expected, unexpected, flaky, skipped, duration } = report.stats;
const countInterrupted = (suites) =>
  suites.reduce(
    (count, suite) =>
      count +
      (suite.specs ?? [])
        .flatMap((spec) => spec.tests)
        .filter((test) => test.results.at(-1)?.status === "interrupted")
        .length +
      countInterrupted(suite.suites ?? []),
    0,
  );
const interrupted = countInterrupted(report.suites);
const skippedOrUnrun = Math.max(0, skipped - interrupted);
console.log("### E2E results\n");
console.log(
  "| Expected | Failed | Passed on retry | Skipped / not run | Interrupted | Duration |\n| ---: | ---: | ---: | ---: | ---: | ---: |",
);
console.log(
  `| ${expected} | ${unexpected} | ${flaky} | ${skippedOrUnrun} | ${interrupted} | ${(duration / 1000).toFixed(1)}s |`,
);
if (report.errors?.length) {
  console.log(`\nCollection or runner errors: ${report.errors.length}`);
}
const tests = [];
const walk = (suite) => {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      tests.push({
        file: spec.file,
        title: spec.title.replaceAll("|", "\\|"),
        duration: test.results.reduce(
          (total, result) => total + result.duration,
          0,
        ),
        attempts: test.results.length,
        status: test.status,
        expectedStatus: test.expectedStatus,
        lastStatus: test.results.at(-1)?.status,
        setupTimeouts: test.results.filter((result) =>
          [result.error, ...(result.errors ?? [])].some((error) =>
            /while setting up|Fixture .*timeout.*during setup/i.test(
              error?.message ?? "",
            ),
          ),
        ).length,
      });
    }
  }
  for (const child of suite.suites ?? []) walk(child);
};
for (const suite of report.suites) walk(suite);
const files = new Map();
for (const test of tests) {
  const row = files.get(test.file) ?? {
    expected: 0,
    unexpected: 0,
    flaky: 0,
    skipped: 0,
    unrun: 0,
    interrupted: 0,
    setupTimeouts: 0,
  };
  if (test.lastStatus === "interrupted") row.interrupted++;
  else if (test.expectedStatus === "skipped") row.skipped++;
  else if (!test.attempts || test.lastStatus === "skipped") row.unrun++;
  else row[test.status]++;
  row.setupTimeouts += test.setupTimeouts;
  files.set(test.file, row);
}
console.log(
  "\n| File | Expected | Failed | Flaky | Skipped | Not run | Interrupted | Setup timeouts |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
);
for (const [file, row] of files) {
  console.log(
    `| ${file} | ${row.expected} | ${row.unexpected} | ${row.flaky} | ${row.skipped} | ${row.unrun} | ${row.interrupted} | ${row.setupTimeouts} |`,
  );
}
console.log(
  "\nThe Expected count includes expected failures. The summary combines skipped and unrun tests; the per-file table lists them separately.",
);
console.log("\nSlowest test bodies (including retries):\n");
console.log(
  "| Test | Seconds | Attempts | Result |\n| --- | ---: | ---: | --- |",
);
for (const test of tests.sort((a, b) => b.duration - a.duration).slice(0, 5)) {
  console.log(
    `| ${test.title} | ${(test.duration / 1000).toFixed(1)} | ${test.attempts} | ${test.status} |`,
  );
}

console.log(
  "\nTotal duration includes browser startup and other setup. Setup time assigned to fixtures with their own timeouts is excluded from individual test durations.",
);
