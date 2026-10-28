import { Console } from "./lib/Console";
import { gotoWithExtension } from "./lib/readiness";
import { expect, test } from "./lib/serverFixture";

test.use({ siteProfile: "scrollable" });

test("renders configured and system color schemes", async ({
  server,
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await gotoWithExtension(page, server.url());
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
