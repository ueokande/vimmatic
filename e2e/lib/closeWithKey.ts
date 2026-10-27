import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const closeWithKey = async (
  page: Page,
  key: string,
  api: typeof browser,
) => {
  const target = (await api.tabs.query({})).find(
    (tab) => tab.url === page.url(),
  );
  if (target?.id === undefined)
    throw new Error("Could not find the tab to close");
  try {
    await page.keyboard.press(key);
  } catch (error) {
    // Firefox may destroy the input target before acknowledging keyup.
    if (
      !(error instanceof Error) ||
      !error.message.includes("Target page, context or browser has been closed")
    )
      throw error;
  }
  // Native tab removal is observable even when Firefox omits Page.close.
  await expect
    .poll(async () =>
      (await api.tabs.query({})).some((tab) => tab.id === target.id),
    )
    .toBe(false);
};
