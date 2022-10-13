import { test, expect } from "./lib/fixture";
import TestServer from "./lib/TestServer";

const server = new TestServer().receiveContent("/*", "ok");

const setupTabs = async (api) => {
  const { id: windowId } = await api.windows.getCurrent();
  const tabs = [];
  for (let i = 1; i <= 5; i++) {
    const url = server.url(`/${i}`);
    const active = i === 3;
    const tab = await api.tabs.create({ windowId, url, active });
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

test("deletes tab and selects right by d", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("d");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/4"), active: true },
      { url: server.url("/5") },
    ]);
});

test("deletes tab and selects left by D", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("Shift+D");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2"), active: true },
      { url: server.url("/4") },
      { url: server.url("/5") },
    ]);
});

test("deletes all tabs to the right by x$", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("x");
  await page.keyboard.press("$");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/3"), active: true },
    ]);
});

test("duplicates tab by zd", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await page.keyboard.press("z");
  await page.keyboard.press("d");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: "about:blank" }, { url: "about:blank" }]);
});

test("makes pinned by zp", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await page.keyboard.press("z");
  await page.keyboard.press("p");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: "about:blank", pinned: true }]);
});

test.fixme("switches to reader view", async ({ page }) => {
  await page.keyboard.press("z");
  await page.keyboard.press("r");

  await expect
    .poll(() => page.console.getErrorMessage())
    .toBe("The specified tab cannot be placed into reader mode.");
});

test("selects previous tab by K", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("Shift+K");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2"), active: true },
      { url: server.url("/3") },
      { url: server.url("/4") },
      { url: server.url("/5") },
    ]);

  await page.keyboard.press("Shift+K");
  await page.keyboard.press("Shift+K");
  await page.keyboard.press("Shift+K");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/3") },
      { url: server.url("/4") },
      { url: server.url("/5"), active: true },
    ]);
});

test("selects next tab by J", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("Shift+J");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/3") },
      { url: server.url("/4"), active: true },
      { url: server.url("/5") },
    ]);

  await page.keyboard.press("Shift+J");
  await page.keyboard.press("Shift+J");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank", active: true },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/3") },
      { url: server.url("/4") },
      { url: server.url("/5") },
    ]);
});

test("selects first tab by g0 and last tab by g$", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("g");
  await page.keyboard.press("0");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank", active: true },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/3") },
      { url: server.url("/4") },
      { url: server.url("/5") },
    ]);

  await page.keyboard.press("g");
  await page.keyboard.press("$");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/3") },
      { url: server.url("/4") },
      { url: server.url("/5"), active: true },
    ]);
});

test("selects last selected tab by Control+6", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("Shift+J");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/3") },
      { url: server.url("/4"), active: true },
      { url: server.url("/5") },
    ]);

  await page.keyboard.press("Control+6");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/3"), active: true },
      { url: server.url("/4") },
      { url: server.url("/5") },
    ]);
});

test.fixme("reopen tab by u", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);
  await page.keyboard.press("d");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/4") },
      { url: server.url("/5") },
    ]);

  await page.keyboard.press("u");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/3") },
      { url: server.url("/4") },
      { url: server.url("/5") },
    ]);
});

test("does not delete pinned tab by !d", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  const tabs = await setupTabs(api);
  await api.tabs.update(tabs[2].id, {
    pinned: true,
    active: true,
  });

  await page.keyboard.press("d");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("/3"), pinned: true },
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/4") },
      { url: server.url("/5") },
    ]);

  await page.keyboard.press("!");
  await page.keyboard.press("d");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/4") },
      { url: server.url("/5") },
    ]);
});

test("opens view-source by gf", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await page.keyboard.press("g");
  await page.keyboard.press("f");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: "view-source:about:blank" },
    ]);
});
