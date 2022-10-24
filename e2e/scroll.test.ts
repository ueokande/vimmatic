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

  const scrollY = await page.evaluate(() => window.pageYOffset);
  expect(scrollY).toBe(64);
});

test("scrolls down by k", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.keyboard.press("k");

  const scrollY = await page.evaluate(() => window.pageYOffset);
  expect(scrollY).toBe(36);
});

test("scrolls left by h", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(100, 0));
  await page.keyboard.press("h");

  const scrollX = await page.evaluate(() => window.pageXOffset);
  expect(scrollX).toBe(36);
});

test("scrolls left by l", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(100, 0));
  await page.keyboard.press("l");

  const scrollX = await page.evaluate(() => window.pageXOffset);
  expect(scrollX).toBe(164);
});

test("scrolls top by gg", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.keyboard.press("g");
  await page.keyboard.press("g");

  const scrollY = await page.evaluate(() => window.pageYOffset);
  expect(scrollY).toBe(0);
});

test("scrolls bottom by G", async ({ page }) => {
  await page.goto(server.url());
  await page.keyboard.press("Shift+G");

  const scrollY = await page.evaluate(() => window.pageYOffset);
  expect(scrollY).toBeGreaterThan(5000);
});

test("scrolls bottom by 0", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(100, 100));
  await page.keyboard.press("0");

  const scrollX = await page.evaluate(() => window.pageXOffset);
  expect(scrollX).toBe(0);
});

test("scrolls bottom by $", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(100, 100));
  await page.keyboard.press("$");

  const scrollX = await page.evaluate(() => window.pageXOffset);
  expect(scrollX).toBeGreaterThan(5000);
});

test("scrolls bottom by <C-U>", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.keyboard.press("Control+u");

  const scrollY = await page.evaluate(() => window.pageYOffset);
  const pageHeight = await page.evaluate(
    () => window.document.documentElement.clientHeight
  );

  expect(Math.abs(scrollY - (1000 - pageHeight / 2))).toBeLessThan(5);
});

test("scrolls bottom by <C-D>", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.keyboard.press("Control+d");

  const scrollY = await page.evaluate(() => window.pageYOffset);
  const pageHeight = await page.evaluate(
    () => window.document.documentElement.clientHeight
  );

  expect(Math.abs(scrollY - (1000 + pageHeight / 2))).toBeLessThan(5);
});

test("scrolls bottom by <C-B>", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.keyboard.press("Control+b");

  const scrollY = await page.evaluate(() => window.pageYOffset);
  const pageHeight = await page.evaluate(
    () => window.document.documentElement.clientHeight
  );

  expect(Math.abs(scrollY - (1000 - pageHeight))).toBeLessThan(5);
});

test("scrolls bottom by <C-F>", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.keyboard.press("Control+f");

  const scrollY = await page.evaluate(() => window.pageYOffset);
  const pageHeight = await page.evaluate(
    () => window.document.documentElement.clientHeight
  );

  expect(Math.abs(scrollY - (1000 + pageHeight))).toBeLessThan(5);
});
