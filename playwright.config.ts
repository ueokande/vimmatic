import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 20_000,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  outputDir: "test-results/artifacts",
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    browserName: "firefox",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
