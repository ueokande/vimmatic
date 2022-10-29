import { test, expect } from "./lib/fixture";
import { newNopServer } from "./lib/servers";
import SettingRepository from "./lib/SettingRepository";
import Settings from "../src/shared/settings/Settings";

const server = newNopServer();

const setupTabs = async (api) => {
  const { id: windowId } = await api.windows.getCurrent();
  const tabs = [];
  for (let i = 1; i <= 4; i++) {
    const url = server.url(`/site${i}`);
    const pinned = i === 1 || i === 2;
    const active = false;
    const tab = await api.tabs.create({ windowId, url, active, pinned });
    tabs.push(tab);
  }
  return tabs;
};

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

const setupSearchEngines = async (api) => {
  await new SettingRepository(api).saveJSON(
    Settings.fromJSON({
      search: {
        default: "google",
        engines: {
          google: server.url("/google") + "?q={}",
          yahoo: server.url("/yahoo") + "?q={}",
        },
      },
    })
  );
};

test.describe("addbookmark command", () => {
  test("should add a bookmark from the current page", async ({ api, page }) => {
    await page.goto(server.url("/bookmark"));
    await page.console.exec("addbookmark my great bookmark");

    await expect
      .poll(() => api.bookmarks.search({ title: "my great bookmark" }))
      .toMatchObject([{ url: server.url("/bookmark") }]);
  });
});

test.describe("open command", () => {
  test("should open search result for keywords", async ({ page, api }) => {
    await setupSearchEngines(api);
    await page.reload();
    await page.console.exec("open an apple");

    await expect
      .poll(() => page.url())
      .toBe(server.url("/google") + "?q=an%20apple");
  });
});

test.describe("buffer command", () => {
  test("should select a tab by title", async ({ page, api }) => {
    const { id: windowId } = await api.windows.getCurrent();
    await setupTabs(api);

    await page.console.exec("buffer site1");

    await expect
      .poll(() => api.tabs.query({ windowId }))
      .toMatchObject([
        { url: server.url("/site1"), active: true },
        { url: server.url("/site2") },
        { url: "about:blank" },
        { url: server.url("/site3") },
        { url: server.url("/site4") },
      ]);
  });
});

test.describe("bdelete command", () => {
  test("should delete a tab by keyword", async ({ page, api }) => {
    const { id: windowId } = await api.windows.getCurrent();
    await setupTabs(api);

    await page.console.exec("bdelete site3");
    await expect
      .poll(() => api.tabs.query({ windowId }))
      .toMatchObject([
        { url: server.url("/site1") },
        { url: server.url("/site2") },
        { url: "about:blank" },
        { url: server.url("/site4") },
      ]);

    await page.console.exec("bdelete! site2");
    await expect
      .poll(() => api.tabs.query({ windowId }))
      .toMatchObject([
        { url: server.url("/site1") },
        { url: "about:blank" },
        { url: server.url("/site4") },
      ]);
  });
});

test.describe("bdeletes command", () => {
  test("should delete tabs by keyword", async ({ page, api }) => {
    const { id: windowId } = await api.windows.getCurrent();
    await setupTabs(api);

    await page.console.exec("bdeletes site");

    await expect
      .poll(() => api.tabs.query({ windowId }))
      .toMatchObject([
        { url: server.url("/site1") },
        { url: server.url("/site2") },
        { url: "about:blank" },
      ]);

    await page.console.exec("bdeletes! site");

    await expect
      .poll(() => api.tabs.query({ windowId }))
      .toMatchObject([{ url: "about:blank" }]);
  });
});
