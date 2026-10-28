import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

const startMarkMode = async (
  page: Page,
  api: typeof browser,
  key: string,
  mode: "mark-set" | "mark-jump",
) => {
  await page.keyboard.press(key);
  // The prefix changes mode asynchronously in the background. Sending the
  // mark name immediately can reach normal mode and silently do nothing.
  await expect
    .poll(async () => {
      const state = await api.storage.local.get("ModeRepositoryImpl");
      return state.ModeRepositoryImpl;
    })
    .toBe(JSON.stringify(mode));
};

export const setMark = async (
  page: Page,
  api: typeof browser,
  name: string,
) => {
  await startMarkMode(page, api, "m", "mark-set");
  await page.keyboard.type(name);
  const scope = name === name.toUpperCase() ? "global" : "local";
  await expect(
    page
      .frameLocator("#vimmatic-console-frame")
      .getByText(`Set ${scope} mark to '${name}'`, { exact: true }),
  ).toBeVisible();
};

export const jumpToMark = async (
  page: Page,
  api: typeof browser,
  name: string,
) => {
  await startMarkMode(page, api, "'", "mark-jump");
  await page.keyboard.type(name);
};
