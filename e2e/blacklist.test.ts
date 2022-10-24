import { test, expect } from "./lib/fixture";
import { newScrollableServer } from "./lib/servers";
import SettingRepository from "./lib/SettingRepository";
import Settings from "../src/shared/settings/Settings";

const setupBlacklist = async (api, blacklist: unknown) => {
  await new SettingRepository(api).saveJSON(
    Settings.fromJSON({
      blacklist,
    })
  );
};

const server = newScrollableServer();

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
  await setupBlacklist(api, [new URL(server.url()).host + "/a"]);

  await page.goto(server.url("/a"));
  await page.keyboard.press("j");

  const y = await page.evaluate(() => window.pageYOffset);
  expect(y).toBe(0);
});

test("should enabled add-on if the URL is not in the blacklist", async ({
  page,
  api,
}) => {
  await setupBlacklist(api, [new URL(server.url()).host + "/a"]);

  await page.goto(server.url("/ab"));
  await page.keyboard.press("j");

  const y = await page.evaluate(() => window.pageYOffset);
  expect(y).toBe(64);
});

test("should disable keys in the partial blacklist", async ({ page, api }) => {
  await setupBlacklist(api, [{ url: new URL(server.url()).host, keys: ["k"] }]);

  await page.goto(server.url());

  await page.keyboard.press("j");
  const y1 = await page.evaluate(() => window.pageYOffset);
  expect(y1).toBe(64);

  await page.keyboard.press("k");
  const y2 = await page.evaluate(() => window.pageYOffset);
  expect(y2).toBe(64);
});
