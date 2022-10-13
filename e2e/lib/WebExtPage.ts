import type { Page, Keyboard } from "@playwright/test";
import Console from "./Console";
import Selection from "./Selection";

export default class WebExtPage {
  private readonly page: Page;
  readonly console: Console;
  readonly selection: Selection;
  readonly keyboard: Keyboard;

  constructor(page: Page) {
    this.page = page;
    this.console = new Console(page);
    this.selection = new Selection(page);
    this.keyboard = page.keyboard;
  }

  async goto(url: string) {
    await this.page.goto(url);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  evaluate(code: unknown): Promise<unknown> {
    return this.page.evaluate(code as any);
  }

  locator(selector: string) {
    return this.page.locator(selector);
  }

  waitForNavigation() {
    return this.page.waitForNavigation;
  }

  frame(selector: string) {
    return this.page.frame(selector);
  }

  async reload() {
    await this.page.reload();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  url() {
    return this.page.url();
  }
}
