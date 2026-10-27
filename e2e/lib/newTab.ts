import type { BrowserContext, Page } from "@playwright/test";
import { waitForContentReady } from "./readiness";

export const newTab = async (
  context: BrowserContext,
  api: typeof browser,
  opener: Page,
  url: string,
): Promise<Page> => {
  const tabs = await api.tabs.query({});
  const parent = tabs.find((tab) => tab.url === opener.url());
  if (!parent) throw new Error("Could not find the opener tab");
  // Playwright newPage creates another Firefox window. Use the browser API
  // when the scenario requires tabs in the same window.
  const opened = context.waitForEvent("page");
  await api.tabs.create({ url, windowId: parent.windowId });
  const page = await opened;
  await waitForContentReady(page);
  return page;
};
