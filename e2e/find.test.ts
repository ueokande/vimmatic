import { type Page } from "@playwright/test";
import { test, expect } from "./lib/fixture";
import { newSingleContentServer } from "./lib/servers";

const server = newSingleContentServer(
  `<!DOCTYPE html><html lang="en"><body>--hello--hello--hello--</body></html>`,
);

const expectSelection = (page: Page) =>
  expect.poll(() =>
    page.evaluate(() => {
      const selection = window.getSelection();
      return { from: selection.anchorOffset, to: selection.focusOffset };
    }),
  );

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("starts searching", async ({ page }) => {
  await page.goto(server.url());

  await page.keyboard.type("/hello");
  await page.keyboard.press("Enter");
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

test("starts regexp searching", async ({ page }) => {
  await page.goto(server.url());

  await page.keyboard.type(":set findmode=regexp");
  await page.keyboard.press("Enter");
  await page.keyboard.type("/h...o");
  await page.keyboard.press("Enter");
  await expectSelection(page).toEqual({ from: 2, to: 7 });
});

test("search with last keyword if keyword is empty", async ({ page }) => {
  await page.goto(server.url());

  await page.keyboard.type("/hello");
  await page.keyboard.press("Enter");

  await page.keyboard.type("/");
  await page.keyboard.press("Enter");

  await expectSelection(page).toEqual({ from: 2, to: 7 });
});

test("search with last keyword on new page", async ({ page }) => {
  await page.goto(server.url());
  await page.keyboard.type("/hello");
  await page.keyboard.press("Enter");

  await page.reload();
  await page.keyboard.press("n");
  await expectSelection(page).toEqual({ from: 2, to: 7 });
});
