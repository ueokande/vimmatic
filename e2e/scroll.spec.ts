import type { Page } from "@playwright/test";
import { test, expect } from "./lib/fixture";
import { newScrollableServer } from "./lib/servers";

const server = newScrollableServer();
const expectScrollX = (page: Page) =>
  expect.poll(() => page.evaluate(() => window.scrollX));
const expectScrollY = (page: Page) =>
  expect.poll(() => page.evaluate(() => window.scrollY));

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("scroll by j/k/h/l", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(1000, 1000));

  await page.keyboard.press("j");
  await expectScrollY(page).toBe(1064);

  await page.keyboard.press("k");
  await expectScrollY(page).toBe(1000);

  await page.keyboard.press("l");
  await expectScrollX(page).toBe(1064);

  await page.keyboard.press("h");
  await expectScrollX(page).toBe(1000);
});

test("scrolls top/bottom by gg/G/0/$", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(1000, 1000));

  await page.keyboard.press("g");
  await page.keyboard.press("g");
  await expectScrollY(page).toBe(0);

  await page.keyboard.press("Shift+G");
  await expectScrollY(page).toBeGreaterThan(5000);

  await page.keyboard.press("0");
  await expectScrollX(page).toBe(0);

  await page.keyboard.press("$");
  await expectScrollX(page).toBeGreaterThan(5000);
});

test("scroll by pages", async ({ page }) => {
  await page.goto(server.url());
  const pageHeight = await page.evaluate(
    () => window.document.documentElement.clientHeight,
  );

  await page.evaluate(() => window.scrollBy(1000, 1000));
  await page.keyboard.press("Control+u");
  await expectScrollY(page).toBe(1000 - pageHeight / 2);

  await page.keyboard.press("Control+d");
  await expectScrollY(page).toBe(1000);

  await page.keyboard.press("Control+b");
  await expectScrollY(page).toBe(1000 - pageHeight);

  await page.keyboard.press("Control+f");
  await expectScrollY(page).toBe(1000);
});
