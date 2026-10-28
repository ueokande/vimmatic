import { Console } from "./lib/Console";
import { expect, test } from "./lib/fixture";
import { newScrollableServer } from "./lib/servers";

const server = newScrollableServer();
test.beforeAll(() => server.start());
test.afterAll(() => server.stop());

test("renders configured and system color schemes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(server.url());
  const console = new Console(page);
  for (const [scheme, color] of [
    ["dark", "rgb(5, 32, 39)"],
    ["light", "rgb(255, 255, 255)"],
    ["system", "rgb(255, 255, 255)"],
  ]) {
    await console.exec(`set colorscheme=${scheme}`);
    await console.show();
    await expect(console.input).toHaveCSS("background-color", color);
    await console.hide();
  }
});
