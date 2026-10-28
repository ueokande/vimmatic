import type { Page } from "@playwright/test";
import { Console } from "./lib/Console";
import { expect, test } from "./lib/serverFixture";

test.use({ siteProfile: "find" });

const expectSelection = (page: Page) =>
  expect.poll(() =>
    page.evaluate(() => {
      const selection = window.getSelection();
      return { from: selection?.anchorOffset, to: selection?.focusOffset };
    }),
  );

test("starts searching", async ({ server, page }) => {
  await page.goto(server.url());

  const console = new Console(page);
  await page.keyboard.type("/");
  await console.expectReady();
  await console.input.fill("hello");
  await console.input.press("Enter");
  await console.waitForClosed();
  await expectSelection(page).toEqual({ from: 2, to: 7 });

  // search next keyword
  await page.keyboard.press("n");
  await expectSelection(page).toEqual({ from: 9, to: 14 });

  // search previous keyword
  await page.keyboard.press("Shift+N");
  await expectSelection(page).toEqual({ from: 2, to: 7 });

  // search previous keyword by wrap-search
  await page.keyboard.press("Shift+N");
  await expectSelection(page).toEqual({ from: 16, to: 21 });
});

test("starts regexp searching", async ({ server, page }) => {
  await page.goto(server.url());

  await new Console(page).exec("set findmode=regexp");
  const console = new Console(page);
  await page.keyboard.type("/");
  await console.expectReady();
  await console.input.fill("h...o");
  await console.input.press("Enter");
  await console.waitForClosed();
  await expectSelection(page).toEqual({ from: 2, to: 7 });
});
