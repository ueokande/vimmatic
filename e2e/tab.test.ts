import { test, expect } from "./lib/fixture";
import { newNopServer } from "./lib/servers";

const server = newNopServer();
let windowId: number;

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test.beforeEach(async ({ api, page }) => {
  windowId = (await api.windows.getCurrent()).id;
  await setupTabs(api);
  await page.goto(server.url("2"));
});

const setupTabs = async (api: typeof browser) => {
  for (const i of [0, 1, 3, 4]) {
    await api.tabs.create({
      windowId,
      url: server.url(`${i}`),
      active: false,
      index: i,
    });
  }
};

test("select tab", async ({ page, api }) => {
  await expect
    .poll(() => api.tabs.query({ windowId, active: true }))
    .toMatchObject([{ url: server.url("2") }]);

  await page.keyboard.press("Shift+J");
  await page.keyboard.press("Shift+J");
  await expect
    .poll(() => api.tabs.query({ windowId, active: true }))
    .toMatchObject([{ url: server.url("4") }]);

  await page.keyboard.press("Shift+K");
  await page.keyboard.press("Shift+K");
  await expect
    .poll(() => api.tabs.query({ windowId, active: true }))
    .toMatchObject([{ url: server.url("2") }]);

  await page.keyboard.press("g");
  await page.keyboard.press("0");
  await expect
    .poll(() => api.tabs.query({ windowId, active: true }))
    .toMatchObject([{ url: server.url("0"), active: true }]);

  await page.keyboard.press("g");
  await page.keyboard.press("$");
  await expect
    .poll(() => api.tabs.query({ windowId, active: true }))
    .toMatchObject([{ url: server.url("4"), active: true }]);

  await page.keyboard.press("Control+6");
  await expect
    .poll(() => api.tabs.query({ windowId, active: true }))
    .toMatchObject([{ url: server.url("0"), active: true }]);
});

test("deletes tab and selects right by d", async ({ page, api }) => {
  await page.keyboard.press("d");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("0") },
      { url: server.url("1") },
      { url: server.url("3"), active: true },
      { url: server.url("4") },
    ]);
});

test("deletes tab and selects left by D", async ({ page, api }) => {
  await page.keyboard.press("Shift+D");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("0") },
      { url: server.url("1"), active: true },
      { url: server.url("3") },
      { url: server.url("4") },
    ]);
});

test("deletes all tabs to the right by x$", async ({ page, api }) => {
  await page.keyboard.press("x");
  await page.keyboard.press("$");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("0") },
      { url: server.url("1") },
      { url: server.url("2"), active: true },
    ]);
});

test("duplicate and make pinned", async ({ page, api }) => {
  await page.keyboard.type("zd");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("0") },
      { url: server.url("1") },
      { url: server.url("2") },
      { url: server.url("2") },
      { url: server.url("3") },
      { url: server.url("4") },
    ]);

  await page.keyboard.type("zp");
  await expect
    .poll(() => api.tabs.query({ windowId, pinned: true }))
    .toMatchObject([{ url: server.url("2") }]);
});

test("reopen tab by u", async ({ page, api }) => {
  const tabs = await api.tabs.query({ windowId });
  await api.tabs.remove(tabs[4].id);

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("0") },
      { url: server.url("1") },
      { url: server.url("2") },
      { url: server.url("3") },
    ]);

  await page.keyboard.press("u");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("0") },
      { url: server.url("1") },
      { url: server.url("2") },
      { url: server.url("3") },
      { url: server.url("4") },
    ]);
});

test("delete a pinned tab", async ({ page, api }) => {
  const tabs = await api.tabs.query({ windowId });
  await api.tabs.update(tabs[2].id, { pinned: true });

  await page.keyboard.press("d");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("2"), pinned: true, active: true },
      { url: server.url("0") },
      { url: server.url("1") },
      { url: server.url("3") },
      { url: server.url("4") },
    ]);

  await page.keyboard.press("!");
  await page.keyboard.press("d");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("0") },
      { url: server.url("1") },
      { url: server.url("3") },
      { url: server.url("4") },
    ]);
});

test("opens view-source by gf", async ({ page, api }) => {
  await page.keyboard.type("gf");
  await expect
    .poll(() => api.tabs.query({ windowId, active: true }))
    .toMatchObject([{ url: "view-source:" + server.url("2") }]);
});
