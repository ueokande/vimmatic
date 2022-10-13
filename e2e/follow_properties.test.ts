import { test, expect } from "./lib/fixture";
import TestServer from "./lib/TestServer";
import SettingRepository from "./lib/SettingRepository";
import Settings from "../src/shared/settings/Settings";

const setupHintchars = async (api) => {
  await new SettingRepository(api).saveJSON(
    Settings.fromJSON({
      keymaps: {
        ":": { type: "command.show" },
        f: { type: "follow.start", newTab: false },
        F: { type: "follow.start", newTab: true, background: false },
        "<C-F>": { type: "follow.start", newTab: true, background: true },
      },
      properties: {
        hintchars: "jk",
      },
    })
  );
};

const resetSettings = async (api) => {
  await new SettingRepository(api).saveJSON(Settings.fromJSON({}));
};

const server = new TestServer().receiveContent(
  "/",
  `
    <!DOCTYPE html>
    <html lang="en"><body>
      <a href="/">link1</a>
      <a href="/">link2</a>
      <a href="/">link3</a>
      <a href="/">link4</a>
      <a href="/">link5</a>
    </body></html>`
);

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
  await page.locator(".vimmatic-hint").first().waitFor();

  let hints = await page.locator(".vimmatic-hint:visible").allInnerTexts();
  expect(hints).toEqual(["J", "K", "JJ", "JK", "KJ"]);

  await page.keyboard.press("j");

  hints = await page.locator(".vimmatic-hint:visible").allInnerTexts();
  expect(hints).toEqual(["J", "JJ", "JK"]);
});

test("should open link into a new tab", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await setupHintchars(api);
  await page.goto(server.url());
  await page.keyboard.press("Shift+F");
  await page.locator(".vimmatic-hint").first().waitFor();
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
  await page.locator(".vimmatic-hint").first().waitFor();
  await page.keyboard.press("j");
  await page.keyboard.press("j");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ active: true }, { active: false }]);
});

test("should show hints with set hintchars", async ({ page }) => {
  await page.goto(server.url());
  await page.console.exec("set hintchars=abc");
  await new Promise((resolve) => setTimeout(resolve, 500));

  await page.keyboard.press("f");
  await page.locator(".vimmatic-hint").first().waitFor();
  const hints = await page.locator(".vimmatic-hint:visible").allInnerTexts();

  expect(hints).toEqual(["A", "B", "C", "AA", "AB"]);
});
