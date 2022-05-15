import * as path from "path";
import * as assert from "assert";

import TestServer from "./lib/TestServer";
import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver } from "selenium-webdriver";
import Page from "./lib/Page";

describe("help command test", () => {
  const server = new TestServer();
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;
  let page: Page;

  beforeAll(async () => {
    lanthan = await Builder.forBrowser("firefox")
      .spyAddon(path.join(__dirname, ".."))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();

    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async () => {
    page = await Page.navigateTo(webdriver, server.url());
  });

  it("should open help page by help command ", async () => {
    const console = await page.showConsole();
    await console.execCommand("help");

    await eventually(async () => {
      const tabs = await browser.tabs.query({ active: true });
      assert.strictEqual(tabs[0].url, "https://ueokande.github.io/vim-vixen/");
    });
  });
});
