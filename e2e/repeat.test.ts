import { gotoWithExtension } from "./lib/readiness";
import { requiredId } from "./lib/requiredId";
import { expect, test } from "./lib/serverFixture";

test.use({ siteProfile: "scrollable" });
test.beforeEach(async ({ server, page }) => {
  await gotoWithExtension(page, server.url());
});

test("repeats last operation", async ({ page, api }) => {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  const tabId = requiredId(tab?.id);
  await api.tabs.setZoom(tabId, 1);

  await page.keyboard.type("zi..", { delay: 100 });
  await expect.poll(() => api.tabs.getZoom(tabId)).toBe(1.5);
});

test("repeats zoom-in 3-times", async ({ page, api }) => {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  const tabId = requiredId(tab?.id);
  await api.tabs.setZoom(tabId, 1);

  await page.keyboard.type("3zi", { delay: 100 });
  await expect.poll(() => api.tabs.getZoom(tabId)).toBe(1.5);
});

test("repeats the previous zoom operation 3-times", async ({ page, api }) => {
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  const tabId = requiredId(tab?.id);
  await api.tabs.setZoom(tabId, 1);

  await page.keyboard.type("zi", { delay: 100 });
  await page.keyboard.type("3.", { delay: 100 });
  await expect.poll(() => api.tabs.getZoom(tabId)).toBe(1.75);
});
