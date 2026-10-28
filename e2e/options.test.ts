import { SettingRepository } from "./lib/SettingRepository";
import { expect, test } from "./lib/serverFixture";

test.use({ siteProfile: "scrollable" });

// Firefox extension pages are not exposed as Playwright Page targets.
// App.test.tsx verifies editing/blur/validation/storage; this test exercises
// the real storage event through background and already loaded content.
test("saved settings update keymaps in an already loaded tab", async ({
  server,
  page,
  api,
}) => {
  await page.goto(server.url());
  await new SettingRepository(api).save({
    keymaps: { zz: { type: "scroll.vertically", count: 10 } },
  });
  await expect
    .poll(async () => {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.keyboard.type("zz");
      return page.evaluate(() => window.scrollY);
    })
    .toBe(640);
});
