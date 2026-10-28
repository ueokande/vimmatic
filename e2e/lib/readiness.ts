import type { FrameLocator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const waitForContentReady = async (target: Page | FrameLocator) => {
  await target
    .locator("head[data-vimmatic-content-status=ready]")
    .waitFor({ state: "attached" });
};

export const waitForExtensionReady = async (target: Page | FrameLocator) => {
  await target
    .locator(
      "head[data-vimmatic-content-status=ready][data-vimmatic-console-status=ready]",
    )
    .waitFor({ state: "attached" });
};

export const gotoWithExtension = async (page: Page, url: string) => {
  const response = await page.goto(url);
  expect(response?.ok(), `Test page did not load successfully: ${url}`).toBe(
    true,
  );
  await waitForExtensionReady(page);
  return response;
};
