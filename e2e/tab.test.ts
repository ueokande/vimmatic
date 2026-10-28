import { closeWithKey } from "./lib/closeWithKey";
import { expect } from "./lib/fixture";
import { requiredId } from "./lib/requiredId";
import { withServer } from "./lib/serverFixture";
import type { Server } from "./lib/servers";
import { newNopServer } from "./lib/servers";

const test = withServer(() => newNopServer());
let windowId: number;

test.beforeEach(async ({ server, api, page }) => {
  windowId = requiredId((await api.windows.getCurrent()).id);
  await setupTabs(api, server);
  await page.goto(server.url("2"));
});

const setupTabs = async (api: typeof browser, server: Pick<Server, "url">) => {
  for (const i of [0, 1, 3, 4]) {
    await api.tabs.create({
      windowId,
      url: server.url(`${i}`),
      active: false,
      index: i,
    });
  }
};

test("select tab", async ({ server, page, api }) => {
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

test("deletes tab and selects right by d", async ({ server, page, api }) => {
  await closeWithKey(page, "d", api);
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("0") },
      { url: server.url("1") },
      { url: server.url("3"), active: true },
      { url: server.url("4") },
    ]);
});

test("deletes tab and selects left by D", async ({ server, page, api }) => {
  await closeWithKey(page, "Shift+D", api);
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("0") },
      { url: server.url("1"), active: true },
      { url: server.url("3") },
      { url: server.url("4") },
    ]);
});

test("deletes all tabs to the right by x$", async ({ server, page, api }) => {
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

test("duplicate and make pinned", async ({ server, page, api }) => {
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

test("reopen tab by u", async ({ server, page, api }) => {
  const tabs = await api.tabs.query({ windowId });
  await api.tabs.remove(requiredId(tabs[4].id));

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

test("delete a pinned tab", async ({ server, page, api }) => {
  const tabs = await api.tabs.query({ windowId });
  await api.tabs.update(requiredId(tabs[2].id), { pinned: true });

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
  await closeWithKey(page, "d", api);
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("0") },
      { url: server.url("1") },
      { url: server.url("3") },
      { url: server.url("4") },
    ]);
});

test("opens view-source by gf", async ({ server, page, api }) => {
  await page.keyboard.type("gf");
  await expect
    .poll(() => api.tabs.query({ windowId, active: true }))
    .toMatchObject([{ url: `view-source:${server.url("2")}` }]);
});
