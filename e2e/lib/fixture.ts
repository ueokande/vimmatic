import { createFixture, withExtension } from "playwright-webextext";
import { connect } from "webext-agent";
import WebExtPage from "./WebExtPage";
import fs from "fs/promises";
import os from "os";
import path from "path";

type Browser = typeof browser;

type Fixture = {
  page: WebExtPage;
  api: Browser;
};

const addonPath = "/tmp/vimmatic-mixedin";

const { test: base, expect } = createFixture(addonPath);

export const test = base.extend<Fixture>({
  page: async ({ page: base }, use) => {
    const page = new WebExtPage(base);
    await page.goto("about:blank");
    await use(page);
  },

  api: async ({ page: _ }, use) => {
    const webext = await connect("127.0.0.1:12345");
    await use(webext);
  },
  context: [
    async ({ context, playwright, browserName }, use) => {
      const userDataDir = await fs.mkdtemp(
        path.join(os.tmpdir(), `playwright_${browserName}dev_profile-`),
      );
      const browserType = withExtension(playwright[browserName], addonPath);
      const newContext = await browserType.launchPersistentContext(
        userDataDir,
        {
          headless: false,
        },
      );
      await use(newContext);
      await context.close();
      await fs.rm(userDataDir, { recursive: true });
    },
    { scope: "test" },
  ],
});

export { expect };
