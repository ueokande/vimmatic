import { test, expect } from "./lib/fixture";
import { newNopServer } from "./lib/servers";
import SettingRepository from "./lib/SettingRepository";

const server = newNopServer();

// /site1
// /site2
// /current
// /site3
// /site4
const setupTabs = async (api: typeof browser) => {
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

const setupSearchEngines = async (api: typeof browser) => {
  await new SettingRepository(api).save({
    search: {
      default: "google",
      engines: {
        google: server.url("/google") + "?q={}",
        yahoo: server.url("/yahoo") + "?q={}",
      },
    },
  });
};

test("should add a bookmark by the addbookmark command", async ({
  api,
  page,
}) => {
  await page.goto(server.url("/bookmark"));
  await page.keyboard.type(":addbookmark my great bookmark");
  await page.keyboard.press("Enter");

  await expect
    .poll(() => api.bookmarks.search({ title: "my great bookmark" }))
    .toMatchObject([{ url: server.url("/bookmark") }]);
});

test("should open a search result by the open command", async ({
  page,
  api,
}) => {
  await setupSearchEngines(api);
  await page.goto(server.url("/"));
  await page.keyboard.type(":open an apple");
  await page.keyboard.press("Enter");

  await expect
    .poll(() => page.url())
    .toBe(server.url("/google") + "?q=an%20apple");
});

test("should select a tab by the buffer command", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);
  await page.goto(server.url("/current"));

  await page.keyboard.type(":buffer site1");
  await page.keyboard.press("Enter");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("/site1"), active: true },
      { url: server.url("/site2") },
      { url: server.url("/current") },
      { url: server.url("/site3") },
      { url: server.url("/site4") },
    ]);
});

test("should close a tab by the bdelete command", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);
  await page.goto(server.url("/current"));

  await page.keyboard.type(":bdelete site3");
  await page.keyboard.press("Enter");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("/site1") },
      { url: server.url("/site2") },
      { url: server.url("/current") },
      { url: server.url("/site4") },
    ]);
});

test("should close tabs by the bdeletes command", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);
  await page.goto(server.url("/current"));

  await page.keyboard.type(":bdeletes site");
  await page.keyboard.press("Enter");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("/site1") },
      { url: server.url("/site2") },
      { url: server.url("/current") },
    ]);

  await page.keyboard.type(":bdeletes! site");
  await page.keyboard.press("Enter");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: server.url("/current") }]);
});
