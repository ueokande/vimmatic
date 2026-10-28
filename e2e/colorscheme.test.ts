import { Console } from "./lib/Console";
import { expect } from "./lib/fixture";
import { withServer } from "./lib/serverFixture";
import { newScrollableServer } from "./lib/servers";

const test = withServer(() => newScrollableServer());

test("renders configured and system color schemes", async ({
  server,
  page,
}) => {
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
