import type { FrameLocator, Page } from "@playwright/test";

export const waitForContentReady = async (target: Page | FrameLocator) => {
  await target
    .locator("head[data-vimmatic-content-status=ready]")
    .waitFor({ state: "attached" });
};

export const preparePage = (page: Page) => {
  const goto = page.goto.bind(page);
  page.goto = async (url, options) => {
    const response = await goto(url, options);
    if (/^https?:/.test(url) && options?.waitUntil === undefined) {
      await page
        .locator(
          "head[data-vimmatic-content-status=ready][data-vimmatic-console-status=ready]",
        )
        .waitFor({ state: "attached" });
    }
    return response;
  };
};
