import { createFixture, withExtension } from "playwright-webextext";
import { connect } from "webext-agent";
import fs from "fs/promises";
import os from "os";
import path from "path";

type Browser = typeof browser;

type Fixture = {
  api: Browser;
};

const addonPath = "/tmp/vimmatic-mixedin";

const { test: base, expect } = createFixture(addonPath);

export const test = base.extend<Fixture>({
  api: async ({ context: _ }, use) => {
    const webext = await connect("vimmatic@i-beam.org");
    await use(webext);
  },
  context: [
    async ({ playwright, browserName }, use) => {
      const userDataDir = await fs.mkdtemp(
        path.join(os.tmpdir(), `playwright_${browserName}dev_profile-`),
      );
      const browserType = withExtension(playwright[browserName], addonPath);
      const newContext = await browserType.launchPersistentContext(
        userDataDir,
        {
          // headless: false,
        },
      );

      await use(newContext);
      await newContext.close();
      await fs.rm(userDataDir, { recursive: true });
    },
    { scope: "test" },
  ],
  page: [
    async ({ page }, use) => {
      const originalGoto = page.goto.bind(page);
      page.goto = async (url: string, options?: { waitUntil?: unknown }) => {
        const resp = await originalGoto(url, options);
        if (typeof options?.waitUntil === "undefined") {
          await page
            .locator(
              "head[data-vimmatic-content-status='ready'][data-vimmatic-console-status='ready']",
            )
            .waitFor({ state: "attached" });
        }
        return resp;
      };

      const originalType = page.keyboard.type.bind(page.keyboard);
      page.keyboard.type = async (
        text: string,
        options?: { delay?: number },
      ) => {
        await originalType(text, { delay: options?.delay ?? 50 });
      };
      await use(page);
    },
    { scope: "test" },
  ],
});

export { expect };
