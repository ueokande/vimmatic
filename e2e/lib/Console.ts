import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class Console {
  constructor(private readonly page: Page) {}

  get input() {
    return this.page
      .frameLocator("#vimmatic-console-frame")
      .getByRole("textbox");
  }

  async expectReady() {
    // Firefox's extension document reports hasFocus=false even when its
    // parent iframe and input are active. Assert the focus chain directly;
    // console.test.ts also verifies untargeted keyboard input reaches it.
    await expect(this.page.locator("#vimmatic-console-frame")).toBeFocused();
    await expect
      .poll(() =>
        this.input.evaluate((input) => document.activeElement === input),
      )
      .toBe(true);
  }

  async show() {
    await this.page.bringToFront();
    await this.page.keyboard.type(":");
    await this.expectReady();
  }

  async waitForClosed() {
    await expect(this.input).toHaveCount(0);
    await expect
      .poll(() =>
        this.page.evaluate(
          () =>
            !document.hasFocus() ||
            document.activeElement?.id !== "vimmatic-console-frame",
        ),
      )
      .toBe(true);
  }

  async hide() {
    await this.input.press("Escape");
    await this.waitForClosed();
  }

  async exec(command: string) {
    await this.show();
    await this.input.fill(command);
    await this.input.press("Enter");
    await this.waitForClosed();
  }
}
