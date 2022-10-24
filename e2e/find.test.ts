import { test, expect } from "./lib/fixture";
import { newSingleContentServer } from "./lib/servers";

const server = newSingleContentServer(
  `<!DOCTYPE html><html lang="en"><body>--hello--hello--hello--</body></html>`
);

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("starts searching", async ({ page }) => {
  await page.goto(server.url());
  await page.console.find("hello");

  await expect
    .poll(() => page.selection.getRange())
    .toEqual({ from: 2, to: 7 });

  // search next keyword
  await page.keyboard.press("n");
  await expect
    .poll(() => page.selection.getRange())
    .toEqual({ from: 9, to: 14 });

  // search previous keyword
  await page.keyboard.press("Shift+N");
  await expect
    .poll(() => page.selection.getRange())
    .toEqual({ from: 2, to: 7 });

  // search previous keyword by wrap-search
  await page.keyboard.press("Shift+N");
  await expect
    .poll(() => page.selection.getRange())
    .toEqual({ from: 16, to: 21 });
});

test("shows error if pattern not found", async ({ page }) => {
  await page.goto(server.url());
  await page.console.find("world");

  await expect
    .poll(() => page.console.getErrorMessage())
    .toBe("Pattern not found: world");
});

test("search with last keyword if keyword is empty", async ({ page }) => {
  await page.goto(server.url());
  await page.console.find("hello");
  await page.console.find("");

  await expect
    .poll(() => page.selection.getRange())
    .toEqual({ from: 2, to: 7 });
});

test("search with last keyword on new page", async ({ page }) => {
  await page.goto(server.url());
  await page.console.find("hello");

  await page.reload();
  await page.keyboard.press("n");

  await expect
    .poll(() => page.selection.getRange())
    .toEqual({ from: 2, to: 7 });
});
