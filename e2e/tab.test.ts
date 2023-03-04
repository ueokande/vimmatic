import { test, expect } from "./lib/fixture";

const setupTabs = async (api: typeof browser) => {
  const { id: windowId } = await api.windows.getCurrent();
  for (const i of [0, 1, 3, 4]) {
    await api.tabs.create({
      windowId,
      url: `about:blank#${i}`,
      active: false,
      index: i,
    });
  }
};

test("deletes tab and selects right by d", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("d");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#0" },
      { url: "about:blank#1" },
      { url: "about:blank#3", active: true },
      { url: "about:blank#4" },
    ]);
});

test("deletes tab and selects left by D", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("Shift+D");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#0" },
      { url: "about:blank#1", active: true },
      { url: "about:blank#3" },
      { url: "about:blank#4" },
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
      { url: "about:blank#0" },
      { url: "about:blank#1" },
      { url: "about:blank", active: true },
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
      { url: "about:blank#0" },
      { url: "about:blank#1", active: true },
      { url: "about:blank" },
      { url: "about:blank#3" },
      { url: "about:blank#4" },
    ]);

  await page.keyboard.press("Shift+K");
  await page.keyboard.press("Shift+K");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#0" },
      { url: "about:blank#1" },
      { url: "about:blank" },
      { url: "about:blank#3" },
      { url: "about:blank#4", active: true },
    ]);
});

test("selects next tab by J", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("Shift+J");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#0" },
      { url: "about:blank#1" },
      { url: "about:blank" },
      { url: "about:blank#3", active: true },
      { url: "about:blank#4" },
    ]);

  await page.keyboard.press("Shift+J");
  await page.keyboard.press("Shift+J");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#0", active: true },
      { url: "about:blank#1" },
      { url: "about:blank" },
      { url: "about:blank#3" },
      { url: "about:blank#4" },
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
      { url: "about:blank#0", active: true },
      { url: "about:blank#1" },
      { url: "about:blank" },
      { url: "about:blank#3" },
      { url: "about:blank#4" },
    ]);

  await page.keyboard.press("g");
  await page.keyboard.press("$");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#0" },
      { url: "about:blank#1" },
      { url: "about:blank" },
      { url: "about:blank#3" },
      { url: "about:blank#4", active: true },
    ]);
});

test("selects last selected tab by Control+6", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("Shift+J");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#0" },
      { url: "about:blank#1" },
      { url: "about:blank" },
      { url: "about:blank#3", active: true },
      { url: "about:blank#4" },
    ]);

  await page.keyboard.press("Control+6");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#0" },
      { url: "about:blank#1" },
      { url: "about:blank", active: true },
      { url: "about:blank#3" },
      { url: "about:blank#4" },
    ]);
});

test("reopen tab by u", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  const tabs = await api.tabs.query({ windowId });
  await api.tabs.remove(tabs[4].id);
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#0" },
      { url: "about:blank#1" },
      { url: "about:blank" },
      { url: "about:blank#3" },
    ]);

  await page.keyboard.press("u");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#0" },
      { url: "about:blank#1" },
      { url: "about:blank" },
      { url: "about:blank#3" },
      { url: "about:blank#4" },
    ]);
});

test("does not delete pinned tab by !d", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);
  const tabs = await api.tabs.query({ windowId });
  await api.tabs.update(tabs[2].id, { pinned: true });

  await page.keyboard.press("d");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank", pinned: true, active: true },
      { url: "about:blank#0" },
      { url: "about:blank#1" },
      { url: "about:blank#3" },
      { url: "about:blank#4" },
    ]);

  await page.keyboard.press("!");
  await page.keyboard.press("d");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#0" },
      { url: "about:blank#1" },
      { url: "about:blank#3" },
      { url: "about:blank#4" },
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
