import { test, expect } from "./lib/fixture";

test("repeats last operation", async ({ page, api }) => {
  const tab = await api.tabs.getCurrent();
  await api.tabs.setZoom(tab.id, 1);

  await page.keyboard.type("zi..", { delay: 100 });
  await expect.poll(() => api.tabs.getZoom(tab.id)).toBe(1.5);
});

test("repeats scroll 3-times", async ({ page, api }) => {
  const tab = await api.tabs.getCurrent();
  await api.tabs.setZoom(tab.id, 1);

  await page.keyboard.type("3zi", { delay: 100 });
  await expect.poll(() => api.tabs.getZoom(tab.id)).toBe(1.5);
});

test("repeats tab deletion 3-times", async ({ page, api }) => {
  const tab = await api.tabs.getCurrent();
  await api.tabs.setZoom(tab.id, 1);

  await page.keyboard.type("zi", { delay: 100 });
  await page.keyboard.type("3.", { delay: 100 });
  await expect.poll(() => api.tabs.getZoom(tab.id)).toBe(1.75);
});
