import { test, expect } from "./lib/fixture";
import { newSingleContentServer } from "./lib/servers";
import SettingRepository from "./lib/SettingRepository";

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

const server = newSingleContentServer(`
  <!DOCTYPE html>
  <html lang="en"><body>
    <a href="/">link1</a>
    <a href="/">link2</a>
    <a href="/">link3</a>
    <a href="/">link4</a>
    <a href="/">link5</a>
  </body></html>
`);

test.beforeAll(async () => {
  await server.start();
});

test.afterEach(async ({ api }) => {
  await resetSettings(api);
});

test.afterAll(async () => {
  await server.stop();
});

test("should show hints with hintchars by settings", async ({ page, api }) => {
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

test("should open link into a new tab", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await setupHintchars(api);
  await page.goto(server.url());
  await page.keyboard.press("Shift+F");
  await page.locator("[data-vimmatic-hint]:visible").first().waitFor();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.keyboard.press("j");
  await page.keyboard.press("j");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ active: false }, { active: true }]);
});

test("should open link into new tab in background", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await setupHintchars(api);
  await page.goto(server.url());
  await page.keyboard.press("Control+f");
  await page.locator("[data-vimmatic-hint]:visible").first().waitFor();
  await page.keyboard.press("j");
  await page.keyboard.press("j");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ active: true }, { active: false }]);
});

test("should show hints with set hintchars", async ({ page }) => {
  await page.goto(server.url());
  await page.keyboard.type(":set hintchars=abc");
  await page.keyboard.press("Enter");

  await page.keyboard.press("f");

  await expect
    .poll(() => page.locator("[data-vimmatic-hint]:visible").allInnerTexts())
    .toEqual(["A", "B", "C", "AA", "AB"]);
});
