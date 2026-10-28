import { gotoWithExtension } from "./lib/readiness";
import { SettingRepository } from "./lib/SettingRepository";
import { expect, test } from "./lib/serverFixture";

test.use({ siteProfile: "scrollable" });
const READY_STATE_SELECTOR =
  "head[data-vimmatic-content-status='ready'][data-vimmatic-console-status='ready']";

test("should disable add-on if the URL is in the blacklist", async ({
  server,
  page,
  api,
}) => {
  await new SettingRepository(api).save({
    blacklist: [`${new URL(server.url()).host}/a`],
  });

  await page.goto(server.url("/a"), { waitUntil: "domcontentloaded" });
  await expect(page.locator(READY_STATE_SELECTOR)).not.toBeAttached();

  await page.goto(server.url("/ab"), { waitUntil: "domcontentloaded" });
  await expect(page.locator(READY_STATE_SELECTOR)).toBeAttached();
});

test("should disable keys in the partial blacklist", async ({
  server,
  page,
  api,
}) => {
  await new SettingRepository(api).save({
    blacklist: [{ url: new URL(server.url()).host, keys: ["k"] }],
  });

  await gotoWithExtension(page, server.url());
  await expect(page.locator(READY_STATE_SELECTOR)).toBeAttached();

  await page.keyboard.type("jk");
  expect(await page.evaluate(() => window.scrollY)).toBe(64);
});
