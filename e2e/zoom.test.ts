import { gotoWithExtension } from "./lib/readiness";
import { requiredId } from "./lib/requiredId";
import { expect, test } from "./lib/serverFixture";

test.use({ siteProfile: "empty" });

test("should zoom-in and zoom-out", async ({ server, page, api }) => {
  await gotoWithExtension(page, server.url());

  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  const tabId = requiredId(tab?.id);
  const before = await api.tabs.getZoom(tabId);

  await page.keyboard.type("zi");
  await expect.poll(() => api.tabs.getZoom(tabId)).toBeGreaterThan(before);

  await page.keyboard.type("zo");
  await page.keyboard.type("zo");
  await expect.poll(() => api.tabs.getZoom(tabId)).toBeLessThan(before);

  await page.keyboard.type("zz");

  await expect.poll(() => api.tabs.getZoom(tabId)).toBe(1);
});
