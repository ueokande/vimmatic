import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test as base, expect } from "@playwright/test";
import { withExtension } from "playwright-webextext";
import { connect } from "webext-agent";
import { preparePage } from "./readiness";

type Browser = typeof browser;

type Fixture = {
  api: Browser;
};

const addonPath = "/tmp/vimmatic-mixedin";

export const test = base.extend<Fixture>({
  api: [
    async ({ context: _ }, use) => {
      let webext: Awaited<ReturnType<typeof connect>>;
      await expect(async () => {
        webext = await connect("vimmatic@i-beam.org", { attempts: 1 });
      }).toPass({ timeout: 10_000, intervals: [100, 200, 500] });
      await use(webext!);
    },
    { scope: "test", timeout: 12_000 },
  ],
  page: [
    async ({ context }, use) => {
      // Firefox's initial persistent-context Page can fail to focus designMode
      // frames. A new Page works; remove the unused initial window afterwards.
      const initialPages = context.pages();
      const page = await context.newPage();
      for (const initial of initialPages) await initial.close();
      await page.bringToFront();
      await use(page);
    },
    { scope: "test", timeout: 20_000 },
  ],
  context: [
    async ({ playwright, browserName, headless }, use) => {
      const userDataDir = await fs.mkdtemp(
        path.join(os.tmpdir(), `playwright_${browserName}dev_profile-`),
      );
      const browserType = withExtension(playwright[browserName], addonPath);
      const newContext = await browserType.launchPersistentContext(
        userDataDir,
        {
          headless,
        },
      );

      newContext.pages().forEach(preparePage);
      newContext.on("page", preparePage);
      try {
        await use(newContext);
      } finally {
        try {
          await newContext.close();
        } finally {
          await fs.rm(userDataDir, { recursive: true, force: true });
        }
      }
    },
    // Browser installation/startup has its own budget; functional checks
    // retain the 20-second test timeout from playwright.config.ts.
    { scope: "test", timeout: 30_000 },
  ],
});

export { expect };
