import { test, expect } from "./lib/fixture";
import { newNopServer } from "./lib/servers";
import { SettingRepository } from "./lib/SettingRepository";

const server = newNopServer();

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test.fixme(
  'should show completions from search engines, bookmarks, and histories by "open" command',
  async ({ page, api }) => {
    await api.history.addUrl({
      url: "https://example.com/",
      title: "Example Domain",
    });
    await page.console.show();
    await page.console.type("open ");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        { title: "Search Engines" },
        { title: "Bookmarks" },
        { title: "History" },
      ]);
  },
);

test.fixme(
  'should filter items with titles by keywords on "open" command',
  async ({ page }) => {
    await page.console.show();
    await page.console.type("open getting");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        { title: "Bookmarks", items: [{ text: "Getting Started" }] },
      ]);
  },
);

test.fixme(
  'should filter items with titles by keywords on "tabopen" command',
  async ({ page }) => {
    await page.console.show();
    await page.console.type("tabopen getting");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        { title: "Bookmarks", items: [{ text: "Getting Started" }] },
      ]);
  },
);

test.fixme(
  'should filter items with titles by keywords on "winopen" command',
  async ({ page }) => {
    await page.console.show();
    await page.console.type("winopen getting");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        { title: "Bookmarks", items: [{ text: "Getting Started" }] },
      ]);
  },
);

test.fixme(
  'should display only specified items in "complete" property by set command',
  async ({ page }) => {
    await page.console.exec("set complete=bss");
    await page.console.show();
    await page.console.type("open ");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        { title: "Bookmarks" },
        { title: "Search Engines" },
        { title: "Search Engines" },
      ]);
  },
);

test.fixme(
  'should display only specified items in "complete" property by setting',
  async ({ page, api }) => {
    await new SettingRepository(api).save({
      properties: { complete: "bss" },
    });

    await page.reload();
    await page.console.show();
    await page.console.type("open ");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        { title: "Bookmarks" },
        { title: "Search Engines" },
        { title: "Search Engines" },
      ]);
  },
);
