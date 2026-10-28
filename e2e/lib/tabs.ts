import type { Page } from "@playwright/test";
import { requiredId } from "./requiredId";

const tabIds = new WeakMap<Page, number>();

export const registerTab = (page: Page, tab: { id?: number }) => {
  tabIds.set(page, requiredId(tab.id));
};

export const nativeTabFor = async (page: Page, api: typeof browser) => {
  const id = tabIds.get(page);
  if (id === undefined) throw new Error("Page has no registered native tab");
  return api.tabs.get(id);
};
