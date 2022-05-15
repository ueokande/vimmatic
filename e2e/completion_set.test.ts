import * as path from "path";
import * as assert from "assert";

import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver } from "selenium-webdriver";
import Page from "./lib/Page";

describe("completion on set commands", () => {
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let page: Page;

  beforeAll(async () => {
    lanthan = await Builder.forBrowser("firefox")
      .spyAddon(path.join(__dirname, ".."))
      .build();
    webdriver = lanthan.getWebDriver();
  });

  afterAll(async () => {
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async () => {
    page = await Page.navigateTo(webdriver, `about:blank`);
  });

  it('should show all property names by "set" command with empty params', async () => {
    const console = await page.showConsole();
    await console.inputKeys("set ");

    await eventually(async () => {
      const groups = await console.getCompletions();
      const items = groups[0].items;
      assert.strictEqual(items.length, 5);
      assert.ok(items[0].text.startsWith("hintchars"));
      assert.ok(items[1].text.startsWith("smoothscroll"));
      assert.ok(items[2].text.startsWith("nosmoothscroll"));
      assert.ok(items[3].text.startsWith("complete"));
      assert.ok(items[4].text.startsWith("colorscheme"));
    });
  });

  it('should show filtered property names by "set" command', async () => {
    const console = await page.showConsole();
    await console.inputKeys("set no");

    await eventually(async () => {
      const groups = await console.getCompletions();
      const items = groups[0].items;
      assert.strictEqual(items.length, 1);
      assert.ok(items[0].text.includes("nosmoothscroll"));
    });
  });
});
