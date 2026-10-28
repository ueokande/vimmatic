import { Console } from "./lib/Console";
import { expect, test } from "./lib/fixture";
import { newScrollableServer } from "./lib/servers";

const server = newScrollableServer();
test.beforeAll(() => server.start());
test.afterAll(() => server.stop());

test("opens the console, selects a completion and returns focus on Escape", async ({
  page,
}) => {
  await page.goto(server.url());
  const console = new Console(page);
  await console.show();
  await page.keyboard.type("b");
  const items = page
    .frameLocator("#vimmatic-console-frame")
    .getByRole("menuitem");
  await expect(items).toHaveCount(3);
  await page.keyboard.press("Tab");
  await expect(console.input).toHaveValue("buffer");
  await console.hide();
  await expect(console.input).toHaveCount(0);
  await page.keyboard.press("j");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(64);
});
