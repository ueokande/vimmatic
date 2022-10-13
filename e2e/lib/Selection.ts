import type { Page } from "@playwright/test";

type Range = {
  from: number;
  to: number;
};

export default class Selection {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getRange(): Promise<Range> {
    return this.page.evaluate(() => {
      const selection = window.getSelection();
      return { from: selection.anchorOffset, to: selection.focusOffset };
    });
  }
}
