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
console.log("### E2E実行結果\n");
console.log(
  "| 成功 | 失敗 | リトライで成功 | skip/未実行 | 中断 | 実行時間 |\n| ---: | ---: | ---: | ---: | ---: | ---: |",
);
console.log(
  `| ${expected} | ${unexpected} | ${flaky} | ${skippedOrUnrun} | ${interrupted} | ${(duration / 1000).toFixed(1)}秒 |`,
);
if (report.errors?.length) {
  console.log(`\n収集・実行基盤のエラー: ${report.errors.length}件`);
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
  "\n| ファイル | 期待どおり | 失敗 | flaky | skip | 未実行 | 中断 | 準備timeout |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
);
for (const [file, row] of files) {
  console.log(
    `| ${file} | ${row.expected} | ${row.unexpected} | ${row.flaky} | ${row.skipped} | ${row.unrun} | ${row.interrupted} | ${row.setupTimeouts} |`,
  );
}
console.log(
  "\n「期待どおり」には期待された失敗も含まれます。先頭のskip集計には未実行も含まれるため、ファイル別に区別しています。",
);
console.log("\nテスト本体の実行時間上位（リトライを含む）:\n");
console.log("| テスト | 秒 | 試行 | 結果 |\n| --- | ---: | ---: | --- |");
for (const test of tests.sort((a, b) => b.duration - a.duration).slice(0, 5)) {
  console.log(
    `| ${test.title} | ${(test.duration / 1000).toFixed(1)} | ${test.attempts} | ${test.status} |`,
  );
}

console.log(
  "\n総時間にはブラウザ等の準備も含みます。専用fixtureに割り当てた準備時間は、個別テストの秒数から除外されます。",
);
