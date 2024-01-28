import { test, expect } from "./lib/fixture";

test.fixme(
  'should show all property names by "set" command with empty params',
  async ({ page }) => {
    await page.console.show();
    await page.console.type("set ");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Properties",
          items: [
            { text: "hintchars" },
            { text: "smoothscroll" },
            { text: "nosmoothscroll" },
            { text: "complete" },
            { text: "colorscheme" },
          ],
        },
      ]);

    await page.console.type("no");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        { title: "Properties", items: [{ text: "nosmoothscroll" }] },
      ]);
  },
);
