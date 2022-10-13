import { test, expect } from "./lib/fixture";

test("should zoom in by zi", async ({ page, api }) => {
  const tab = await api.tabs.getCurrent();
  const before = await api.tabs.getZoom(tab.id);

  await page.keyboard.type("zi");

  await expect.poll(() => api.tabs.getZoom(tab.id)).toBeGreaterThan(before);
});

test("should zoom out by zo", async ({ page, api }) => {
  const tab = await api.tabs.getCurrent();
  const before = await api.tabs.getZoom(tab.id);

  await page.keyboard.type("zo");

  await expect.poll(() => api.tabs.getZoom(tab.id)).toBeLessThan(before);
});

test("should reset zoom by zz", async ({ page, api }) => {
  const tab = await api.tabs.getCurrent();
  await api.tabs.setZoom(tab.id, 2);
  await page.keyboard.type("zz");

  await expect.poll(() => api.tabs.getZoom(tab.id)).toBe(1);
});
