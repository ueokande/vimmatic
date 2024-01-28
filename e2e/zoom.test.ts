import { test, expect } from "./lib/fixture";
import { newNopServer } from "./lib/servers";

const server = newNopServer();

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("should zoom-in and zoom-out", async ({ page, api }) => {
  await page.goto(server.url());

  const tab = await api.tabs.getCurrent();
  const before = await api.tabs.getZoom(tab.id);

  await page.keyboard.type("zi");
  await expect.poll(() => api.tabs.getZoom(tab.id)).toBeGreaterThan(before);

  await page.keyboard.type("zo");
  await page.keyboard.type("zo");
  await expect.poll(() => api.tabs.getZoom(tab.id)).toBeLessThan(before);

  await page.keyboard.type("zz");

  await expect.poll(() => api.tabs.getZoom(tab.id)).toBe(1);
});
