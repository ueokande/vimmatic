import { gotoWithExtension, waitForExtensionReady } from "./lib/readiness";
import { expect, test } from "./lib/serverFixture";

test.use({ siteProfile: "navigation" });

test("should go to parent path without hash by gu", async ({
  server,
  page,
}) => {
  await gotoWithExtension(page, server.url("/a/b/c"));
  await page.keyboard.type("gu");

  await expect.poll(() => new URL(page.url()).pathname).toBe("/a/b/");
});

test("should remove hash by gu", async ({ server, page }) => {
  await gotoWithExtension(page, `${server.url("/a/b/c")}#hash`);
  await page.keyboard.type("gu");

  await expect.poll(() => new URL(page.url()).pathname).toBe("/a/b/c");
});

test("should go to root path by gU", async ({ server, page }) => {
  await gotoWithExtension(page, server.url("/a/b/c#hash"));
  await page.keyboard.press("g");
  await page.keyboard.press("Shift+U");

  await expect.poll(() => new URL(page.url()).pathname).toBe("/");
});

test("should go back and forward in history by H and L", async ({
  server,
  page,
}) => {
  await gotoWithExtension(page, server.url("/first"));
  await gotoWithExtension(page, server.url("/second"));

  await page.keyboard.press("Shift+H");
  await expect.poll(() => new URL(page.url()).pathname).toBe("/first");
  await waitForExtensionReady(page);

  await page.keyboard.press("Shift+L");
  await expect.poll(() => new URL(page.url()).pathname).toBe("/second");
});

test("should transit next/prev page in <a> by [[/]]", async ({
  server,
  page,
}) => {
  await gotoWithExtension(page, server.url("/pagination-a/10"));

  await page.keyboard.type("[[");
  await expect.poll(() => new URL(page.url()).pathname).toBe("/pagination-a/9");
  await waitForExtensionReady(page);

  await page.keyboard.type("]]");
  await expect
    .poll(() => new URL(page.url()).pathname)
    .toBe("/pagination-a/10");
});

test("should transit next/prev page in <link> by [[/]]", async ({
  server,
  page,
}) => {
  await gotoWithExtension(page, server.url("/pagination-link/10"));

  await page.keyboard.type("[[");
  await expect
    .poll(() => new URL(page.url()).pathname)
    .toBe("/pagination-link/9");
  await waitForExtensionReady(page);

  await page.keyboard.type("]]");
  await expect
    .poll(() => new URL(page.url()).pathname)
    .toBe("/pagination-link/10");
});

test("should go to home page into current tab by gh", async ({
  server,
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();

  await gotoWithExtension(page, server.url("/initial"));
  await page.keyboard.type("gh");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: "about:blank" }]);
});

test("should go to home page into current tab by gH", async ({
  server,
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();

  await gotoWithExtension(page, server.url());
  await page.keyboard.press("g");
  await page.keyboard.press("Shift+H");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: server.url() }, { url: "about:blank" }]);
});

test("should reload by r", async ({ server, page }) => {
  await gotoWithExtension(page, server.url("/reload"));
  const before = await page.evaluate(
    () => window.performance.timing.navigationStart,
  );

  const reloaded = page.waitForEvent("domcontentloaded");
  await page.keyboard.press("r");
  await reloaded;
  await waitForExtensionReady(page);
  await expect
    .poll(() => page.evaluate(() => window.performance.timing.navigationStart))
    .toBeGreaterThan(before);
});

test("should hard reload by R", async ({ server, page }) => {
  await gotoWithExtension(page, server.url("/reload"));
  await page.evaluate(() => window.scrollBy(0, 100));

  const before = await page.evaluate(() => window.pageYOffset);
  expect(before).toBe(100);

  const reloaded = page.waitForEvent("domcontentloaded");
  await page.keyboard.press("Shift+R");
  await reloaded;
  await waitForExtensionReady(page);
  await expect.poll(() => page.evaluate(() => window.pageYOffset)).toBe(0);
});
