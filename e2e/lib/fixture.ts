import { createFixture } from "playwright-webextext";
import { connect } from "webext-agent";
import WebExtPage from "./WebExtPage";

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
});

export { expect };
