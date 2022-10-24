import { test, expect } from "./lib/fixture";
import { newScrollableServer } from "./lib/servers";

const server = newScrollableServer();

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("repeats last command", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await page.console.exec(`tabopen about:blank?newtab`);
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: "about:blank" }, { url: "about:blank?newtab" }]);

  await page.keyboard.press(".");
  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: "about:blank?newtab" },
      { url: "about:blank?newtab" },
    ]);
});

test("repeats last operation", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  for (let i = 1; i <= 5; ++i) {
    await api.tabs.create({ url: `about:blank?tab${i}`, windowId });
  }

  await page.keyboard.press("d");
  await page.keyboard.press(".");
  await page.keyboard.press(".");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: "about:blank?tab1" },
      { url: "about:blank?tab2" },
    ]);
});

test("repeats scroll 3-times", async ({ page }) => {
  await page.goto(server.url("/"));
  await page.keyboard.press("3");
  await page.keyboard.press("j");

  const y = await page.evaluate(() => window.pageYOffset);
  expect(y).toBe(64 * 3);
});

test("repeats tab deletion 3-times", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  for (let i = 1; i <= 5; ++i) {
    await api.tabs.create({
      url: `about:blank?tab${i}`,
      windowId,
    });
  }

  await page.keyboard.press("d");
  await page.keyboard.press("3");
  await page.keyboard.press(".");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: "about:blank" }, { url: "about:blank?tab1" }]);
});
