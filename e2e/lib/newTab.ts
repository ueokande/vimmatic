import type { BrowserContext, Page } from "@playwright/test";
import { waitForContentReady } from "./readiness";
import { nativeTabFor, registerTab } from "./tabs";

export const newTab = async (
  context: BrowserContext,
  api: typeof browser,
  opener: Page,
  url: string,
): Promise<Page> => {
  const parent = await nativeTabFor(opener, api);
  // Playwright newPage creates another Firefox window. Use the browser API
  // when the scenario requires tabs in the same window.
  const [page, tab] = await Promise.all([
    context.waitForEvent("page"),
    api.tabs.create({ url, windowId: parent.windowId }),
  ]);
  registerTab(page, tab);
  await page.waitForURL(url);
  await waitForContentReady(page);
  return page;
};
