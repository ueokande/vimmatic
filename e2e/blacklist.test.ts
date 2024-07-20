import { test, expect } from "./lib/fixture";
import { newScrollableServer } from "./lib/servers";
import { SettingRepository } from "./lib/SettingRepository";

const server = newScrollableServer();
const READY_STATE_SELECTOR =
  "head[data-vimmatic-content-status='ready'][data-vimmatic-console-status='ready']";

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("should disable add-on if the URL is in the blacklist", async ({
  page,
  api,
}) => {
  await new SettingRepository(api).save({
    blacklist: [new URL(server.url()).host + "/a"],
  });

  await page.goto(server.url("/a"), { waitUntil: "domcontentloaded" });
  await expect(page.locator(READY_STATE_SELECTOR)).not.toBeAttached();

  await page.goto(server.url("/ab"), { waitUntil: "domcontentloaded" });
  await expect(page.locator(READY_STATE_SELECTOR)).toBeAttached();
});

test("should disable keys in the partial blacklist", async ({ page, api }) => {
  await new SettingRepository(api).save({
    blacklist: [{ url: new URL(server.url()).host, keys: ["k"] }],
  });

  await page.goto(server.url());
  await expect(page.locator(READY_STATE_SELECTOR)).toBeAttached();

  await page.keyboard.type("jk");
  expect(await page.evaluate(() => window.scrollY)).toBe(64);
});
