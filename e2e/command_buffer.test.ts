import * as path from "path";
import * as assert from "assert";
import { Request, Response } from "express";

import TestServer from "./lib/TestServer";
import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver } from "selenium-webdriver";
import Page from "./lib/Page";

describe("buffer command test", () => {
  const server = new TestServer().handle(
    "/*",
    (req: Request, res: Response) => {
      res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>my_${req.path.slice(1)}</title>
        </head>
      </html>`);
    }
  );
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;

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
    const tabs = await browser.tabs.query({});
    for (const tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
    await browser.tabs.update(tabs[0].id, { url: server.url("/site1") });
    for (let i = 2; i <= 5; ++i) {
      await browser.tabs.create({ url: server.url("/site" + i) });
    }

    await eventually(async () => {
      const handles = await webdriver.getAllWindowHandles();
      assert.strictEqual(handles.length, 5);
      await webdriver.switchTo().window(handles[2]);
    });
  });

  it("should do nothing by buffer command with no parameters", async () => {
    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("buffer");

    await eventually(async () => {
      const tabs = await browser.tabs.query({ active: true });
      assert.strictEqual(tabs[0].index, 2);
    });
  });

  it("should select a tab by buffer command with a number", async () => {
    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("buffer 1");

    await eventually(async () => {
      const tabs = await browser.tabs.query({ active: true });
      assert.strictEqual(tabs[0].index, 0);
    });
  });

  it("should should an out of range error by buffer commands", async () => {
    const page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand("buffer 0");

    await eventually(async () => {
      const text = await console.getErrorMessage();
      assert.strictEqual(text, "tab 0 does not exist");
    });

    await (webdriver.switchTo() as any).parentFrame();

    console = await page.showConsole();
    await console.execCommand("buffer 9");

    await eventually(async () => {
      const text = await console.getErrorMessage();
      assert.strictEqual(text, "tab 9 does not exist");
    });
  });

  it("should select a tab by buffer command with a title", async () => {
    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("buffer my_site1");

    await eventually(async () => {
      const tabs = await browser.tabs.query({ active: true });
      assert.strictEqual(tabs[0].index, 0);
    });
  });

  it("should select a tab by buffer command with an URL", async () => {
    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("buffer /site1");

    await eventually(async () => {
      const tabs = await browser.tabs.query({ active: true });
      assert.strictEqual(tabs[0].index, 0);
    });
  });

  it("should select tabs rotately", async () => {
    const handles = await webdriver.getAllWindowHandles();
    await webdriver.switchTo().window(handles[4]);

    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("buffer site");

    await eventually(async () => {
      const tabs = await browser.tabs.query({ active: true });
      assert.strictEqual(tabs[0].index, 0);
    });
  });

  it('should do nothing by ":buffer %"', async () => {
    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("buffer %");

    await eventually(async () => {
      const tabs = await browser.tabs.query({ active: true });
      assert.strictEqual(tabs[0].index, 2);
    });
  });

  it('should selects last selected tab by ":buffer #"', async () => {
    const handles = await webdriver.getAllWindowHandles();
    await webdriver.switchTo().window(handles[1]);

    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("buffer #");

    await eventually(async () => {
      const tabs = await browser.tabs.query({ active: true });
      assert.strictEqual(tabs[0].index, 2);
    });
  });
});
