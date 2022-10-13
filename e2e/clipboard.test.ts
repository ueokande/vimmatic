import { test, expect } from "./lib/fixture";
import * as clipboard from "./lib/clipboard";
import SettingRepository from "./lib/SettingRepository";
import Settings from "../src/shared/settings/Settings";

test("should copy current URL by y", async ({ page }) => {
  await page.goto("about:blank#should_copy_url");
  await page.keyboard.press("y");

  await expect.poll(() => clipboard.read()).toBe("about:blank#should_copy_url");
});

test("should open an URL from clipboard by p", async ({ page }) => {
  await clipboard.write("about:blank#open_from_clipboard");
  await page.keyboard.press("p");

  await expect.poll(() => page.url()).toBe("about:blank#open_from_clipboard");
});

test("should open an URL from clipboard to new tab by P", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await clipboard.write("about:blank#open_to_new_tab");
  await page.keyboard.press("Shift+P");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: "about:blank#open_to_new_tab" },
    ]);
});

test("should open search result with keywords in clipboard by p", async ({
  page,
  api,
}) => {
  await new SettingRepository(api).saveJSON(
    Settings.fromJSON({
      search: {
        default: "aboutblank",
        engines: {
          aboutblank: "about:blank?q={}",
        },
      },
    })
  );
  await page.reload();

  await clipboard.write(`an apple`);
  await page.keyboard.press("p");

  await expect.poll(() => page.url()).toBe("about:blank?q=an%20apple");
});

test("should open search result with keywords in clipboard to new tab by P", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await new SettingRepository(api).saveJSON(
    Settings.fromJSON({
      search: {
        default: "aboutblank",
        engines: {
          aboutblank: "about:blank?q={}",
        },
      },
    })
  );
  await page.reload();

  await clipboard.write(`an apple`);
  await page.keyboard.press("Shift+P");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: "about:blank?q=an%20apple" },
    ]);
});
