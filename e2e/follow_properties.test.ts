import { Console } from "./lib/Console";
import { SettingRepository } from "./lib/SettingRepository";
import { expect, test } from "./lib/serverFixture";

const setupHintchars = async (api: typeof browser) => {
  await new SettingRepository(api).save({
    keymaps: {
      ":": { type: "command.show" },
      f: { type: "follow.start", newTab: false },
      F: { type: "follow.start", newTab: true, background: false },
      "<C-F>": { type: "follow.start", newTab: true, background: true },
    },
    properties: {
      hintchars: "jk",
    },
  });
};

const resetSettings = async (api: typeof browser) => {
  await new SettingRepository(api).save({});
};

test.use({ siteProfile: "hints" });

test.afterEach(async ({ api }) => {
  await resetSettings(api);
});

test("should show hints with hintchars by settings", async ({
  server,
  page,
  api,
}) => {
  await setupHintchars(api);
  await page.goto(server.url());
  await page.keyboard.press("f");

  await expect
    .poll(() => page.locator("[data-vimmatic-hint]:visible").allInnerTexts())
    .toEqual(["J", "K", "JJ", "JK", "KJ"]);

  await page.keyboard.press("j");
  await expect
    .poll(() => page.locator("[data-vimmatic-hint]:visible").allInnerTexts())
    .toEqual(["J", "JJ", "JK"]);
});

test("should open link into a new tab", async ({ server, page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await setupHintchars(api);
  await page.goto(server.url());
  await page.keyboard.press("Shift+F");
  await expect
    .poll(() => page.locator("[data-vimmatic-hint]:visible").allInnerTexts())
    .toEqual(["J", "K", "JJ", "JK", "KJ"]);
  await page.keyboard.press("j");
  await expect
    .poll(() => page.locator("[data-vimmatic-hint]:visible").allInnerTexts())
    .toEqual(["J", "JJ", "JK"]);
  await page.keyboard.press("j");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ active: false }, { active: true }]);
});

test("should open link into new tab in background", async ({
  server,
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();

  await setupHintchars(api);
  await page.goto(server.url());
  await page.keyboard.press("Control+f");
  await expect
    .poll(() => page.locator("[data-vimmatic-hint]:visible").allInnerTexts())
    .toEqual(["J", "K", "JJ", "JK", "KJ"]);
  await page.keyboard.press("j");
  await expect
    .poll(() => page.locator("[data-vimmatic-hint]:visible").allInnerTexts())
    .toEqual(["J", "JJ", "JK"]);
  await page.keyboard.press("j");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ active: true }, { active: false }]);
});

test("should show hints with set hintchars", async ({ server, page }) => {
  await page.goto(server.url());
  await new Console(page).exec("set hintchars=abc");

  await page.keyboard.press("f");

  await expect
    .poll(() => page.locator("[data-vimmatic-hint]:visible").allInnerTexts())
    .toEqual(["A", "B", "C", "AA", "AB"]);
});
