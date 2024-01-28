import { test, expect } from "./lib/fixture";
import { newNopServer } from "./lib/servers";

const server = newNopServer();

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test.fixme("changes color scheme by set command", async ({ page }) => {
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
