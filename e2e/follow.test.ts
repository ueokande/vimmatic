import { gotoWithExtension, waitForContentReady } from "./lib/readiness";
import { expect, test } from "./lib/serverFixture";

test.use({ siteProfile: "follow" });

test("should focus an input by f", async ({ server, page }) => {
  await gotoWithExtension(page, server.url("/follow-input"));
  await page.keyboard.press("f");
  await expect(page.locator("[data-vimmatic-hint]")).toHaveCount(1);
  await page.keyboard.press("a");

  await expect
    .poll(() => page.evaluate(() => document.activeElement?.tagName))
    .toBe("INPUT");
});

test("should open a link by f", async ({ server, page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await gotoWithExtension(page, server.url());
  await page.keyboard.press("f");
  await expect(page.locator("[data-vimmatic-hint]")).toHaveCount(1);
  await page.keyboard.press("a");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: server.url("/hello") }]);
});

test("should open a link to new tab by F", async ({ server, page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await gotoWithExtension(page, server.url());
  await page.keyboard.press("Shift+F");
  await expect(page.locator("[data-vimmatic-hint]")).toHaveCount(1);
  await page.keyboard.press("a");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: server.url() }, { url: server.url("/hello") }]);
});

test("shows hints for image map areas", async ({ server, page }) => {
  await gotoWithExtension(page, server.url("/area"));
  await page.keyboard.press("f");
  await expect(page.locator("[data-vimmatic-hint]")).toHaveCount(3);
});

test("shows hints only in the viewport", async ({ server, page }) => {
  await gotoWithExtension(page, server.url("/test1"));
  await page.keyboard.press("f");
  await expect(page.locator("[data-vimmatic-hint]")).toHaveCount(1);
});

for (const [path, description] of [
  ["/test2", "the window containing a tall frame"],
  ["/test3", "a short frame"],
]) {
  test(`shows hints only in ${description}`, async ({ server, page }) => {
    await gotoWithExtension(page, server.url(path));
    const frame = page.frameLocator("iframe[name=inner-frame]");
    await waitForContentReady(frame);
    await page.keyboard.press("f");
    await expect(frame.locator("[data-vimmatic-hint]")).toHaveCount(1);
  });
}
