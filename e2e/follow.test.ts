import { gotoWithExtension, waitForContentReady } from "./lib/readiness";
import { expect, test } from "./lib/serverFixture";

test.use({ siteProfile: "follow" });

test("should focus an input by f", async ({ server, page }) => {
  await gotoWithExtension(page, server.url("/follow-input"));
  await page.keyboard.press("f");
  await page.locator("text=a").waitFor();
  await page.keyboard.press("a");

  await expect
    .poll(() => page.evaluate(() => document.activeElement?.tagName))
    .toBe("INPUT");
});

test("should open a link by f", async ({ server, page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await gotoWithExtension(page, server.url());
  await page.keyboard.press("f");
  await page.locator("text=a").waitFor();
  await page.keyboard.press("a");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: server.url("/hello") }]);
});

test("should open a link to new tab by F", async ({ server, page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await gotoWithExtension(page, server.url());
  await page.keyboard.press("Shift+F");
  await page.locator("text=a").waitFor();
  await page.keyboard.press("a");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: server.url() }, { url: server.url("/hello") }]);
});

test("should show hints of links in area", async ({ server, page }) => {
  await gotoWithExtension(page, server.url("/area"));
  await page.keyboard.press("f");
  await page.locator("text=a").waitFor();

  const hints = await page.locator("[data-vimmatic-hint]").allInnerTexts();
  expect(hints.length).toBe(3);
});

test("should shows hints only in viewport", async ({ server, page }) => {
  await gotoWithExtension(page, server.url("/test1"));
  await page.keyboard.press("f");
  await page.locator("text=a").waitFor();

  const hints = await page.locator("[data-vimmatic-hint]").allInnerTexts();
  expect(hints.length).toBe(1);
});

test("should shows hints only in window of the frame", async ({
  server,
  page,
}) => {
  await gotoWithExtension(page, server.url("/test2"));
  await waitForContentReady(page.frameLocator("iframe[name=inner-frame]"));
  await page.keyboard.press("f");
  await page
    .frameLocator("iframe[name=inner-frame]")
    .locator("text=a")
    .waitFor();

  const hints = await page
    .frameLocator("iframe[name=inner-frame]")
    .locator("[data-vimmatic-hint]")
    .allInnerTexts();
  expect(hints.length).toBe(1);
});

test("should shows hints only in the frame", async ({ server, page }) => {
  await gotoWithExtension(page, server.url("/test3"));
  await waitForContentReady(page.frameLocator("iframe[name=inner-frame]"));
  await page.keyboard.press("f");
  await page
    .frameLocator("iframe[name=inner-frame]")
    .locator("text=a")
    .waitFor();

  const hints = await page
    .frameLocator("iframe[name=inner-frame]")
    .locator("[data-vimmatic-hint]")
    .allInnerTexts();
  expect(hints.length).toBe(1);
});
