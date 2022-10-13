import { test, expect } from "./lib/fixture";
import TestServer from "./lib/TestServer";

const server = new TestServer();

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("changes color scheme by set command", async ({ page }) => {
  await page.goto(server.url());

  await page.console.show();
  await expect
    .poll(() => page.console.getBackgroundColor())
    .toBe("rgb(255, 255, 255)");

  await page.keyboard.type("set colorscheme=dark");
  await page.keyboard.press("Enter");

  await page.console.show();
  await expect
    .poll(() => page.console.getBackgroundColor())
    .toBe("rgb(5, 32, 39)");

  await page.keyboard.type("set colorscheme=light");
  await page.keyboard.press("Enter");

  await page.console.show();
  await expect
    .poll(() => page.console.getBackgroundColor())
    .toBe("rgb(255, 255, 255)");

  await page.keyboard.type("set colorscheme=system");
  await page.keyboard.press("Enter");

  await page.console.show();
  await expect
    .poll(() => page.console.getBackgroundColor())
    .toBe("rgb(255, 255, 255)");
});
