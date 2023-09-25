import type { Page } from "@playwright/test";

type CompletionGroup = {
  title: string;
  items: Array<{ text: string; highlight: boolean }>;
};

export default class Console {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async show() {
    await this.page
      .locator("#vimmatic-console-frame")
      .waitFor({ state: "attached" });
    await this.page.keyboard.press(":");
    await this.consoleFrame()
      .locator("[role=menu]")
      .waitFor({ state: "visible" });
  }

  async exec(command: string) {
    await this.show();
    await this.type(command);
    await this.enter();
  }

  async find(keyword: string) {
    await this.page
      .locator("#vimmatic-console-frame")
      .waitFor({ state: "attached" });
    await this.page.keyboard.press("/");
    await this.type(keyword);
    await this.enter();
  }

  async type(str: string) {
    await this.consoleFrame().locator("input").waitFor({ state: "visible" });
    await this.page.keyboard.type(str);
  }

  async enter() {
    await this.page.keyboard.press("Enter");
  }

  async getCommand(): Promise<string> {
    return this.consoleFrame().evaluate(() => {
      return document.querySelector("input").value;
    });
  }

  async getCompletion(): Promise<CompletionGroup[]> {
    return this.consoleFrame().evaluate(() => {
      const groups = document.querySelectorAll("[role=group]");
      if (groups.length === 0) {
        throw new Error("completion items not found");
      }

      return Array.from(groups).map((group) => {
        const describedby = group.getAttribute("aria-describedby") as string;
        const title = document.getElementById(describedby)!;
        const items = group.querySelectorAll("[role=menuitem]");

        return {
          title: title.textContent!.trim(),
          items: Array.from(items).map((item) => ({
            text: document.getElementById(
              item.getAttribute("aria-labelledby")!,
            )!.textContent,
            highlight: item.getAttribute("aria-selected") === "true",
          })),
        };
      });
    });
  }

  async getBackgroundColor(): Promise<string> {
    return this.consoleFrame().evaluate(() => {
      const input = document.querySelector("input")!;
      return window.getComputedStyle(input).backgroundColor;
    });
  }

  async getErrorMessage(): Promise<string> {
    return this.consoleFrame().textContent("[role=alert]");
  }

  private consoleFrame() {
    return this.page.frame("vimmatic-console-frame");
  }
}
