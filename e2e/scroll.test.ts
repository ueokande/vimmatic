import { test, expect } from "./lib/fixture";
import { newScrollableServer } from "./lib/servers";

const server = newScrollableServer();

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("scrolls up by j", async ({ page }) => {
  await page.goto(server.url());
  await page.keyboard.press("j");

  await expect.poll(() => page.evaluate(() => window.pageYOffset)).toBe(64);
});

test("scrolls down by k", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.keyboard.press("k");

  await expect.poll(() => page.evaluate(() => window.pageYOffset)).toBe(36);
});

test("scrolls left by h", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(100, 0));
  await page.keyboard.press("h");

  await expect.poll(() => page.evaluate(() => window.pageXOffset)).toBe(36);
});

test("scrolls left by l", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(100, 0));
  await page.keyboard.press("l");

  await expect.poll(() => page.evaluate(() => window.pageXOffset)).toBe(164);
});

test("scrolls top by gg", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.keyboard.press("g");
  await page.keyboard.press("g");

  await expect.poll(() => page.evaluate(() => window.pageYOffset)).toBe(0);
});

test("scrolls bottom by G", async ({ page }) => {
  await page.goto(server.url());
  await page.keyboard.press("Shift+G");

  await expect
    .poll(() => page.evaluate(() => window.pageYOffset))
    .toBeGreaterThan(5000);
});

test("scrolls bottom by 0", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(100, 100));
  await page.keyboard.press("0");

  await expect.poll(() => page.evaluate(() => window.pageXOffset)).toBe(0);
});

test("scrolls bottom by $", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(100, 100));
  await page.keyboard.press("$");

  await expect
    .poll(() => page.evaluate(() => window.pageXOffset))
    .toBeGreaterThanOrEqual(5000);
});

test("scrolls bottom by <C-U>", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.keyboard.press("Control+u");

  await expect
    .poll(async () => {
      const scrollY = await page.evaluate(() => window.pageYOffset);
      const pageHeight = await page.evaluate(
        () => window.document.documentElement.clientHeight
      );
      return Math.abs(scrollY - (1000 - pageHeight / 2));
    })
    .toBeLessThan(5);
});

test("scrolls bottom by <C-D>", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.keyboard.press("Control+d");

  await expect
    .poll(async () => {
      const scrollY = await page.evaluate(() => window.pageYOffset);
      const pageHeight = await page.evaluate(
        () => window.document.documentElement.clientHeight
      );
      return Math.abs(scrollY - (1000 + pageHeight / 2));
    })
    .toBeLessThan(5);
});

test("scrolls bottom by <C-B>", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.keyboard.press("Control+b");

  await expect
    .poll(async () => {
      const scrollY = await page.evaluate(() => window.pageYOffset);
      const pageHeight = await page.evaluate(
        () => window.document.documentElement.clientHeight
      );
      return Math.abs(scrollY - (1000 - pageHeight));
    })
    .toBeLessThan(5);
});

test("scrolls bottom by <C-F>", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.keyboard.press("Control+f");

  await expect
    .poll(async () => {
      const scrollY = await page.evaluate(() => window.pageYOffset);
      const pageHeight = await page.evaluate(
        () => window.document.documentElement.clientHeight
      );
      return Math.abs(scrollY - (1000 + pageHeight));
    })
    .toBeLessThan(5);
});
