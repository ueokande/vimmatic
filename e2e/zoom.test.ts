import { expect, test } from "./lib/fixture";
import { requiredId } from "./lib/requiredId";
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
