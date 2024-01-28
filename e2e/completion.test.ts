import { test, expect } from "./lib/fixture";

test.fixme("should shows all commands on empty line", async ({ page }) => {
  await page.console.show();

  await expect
    .poll(() => page.console.getCompletion())
    .toMatchObject([{ title: "Console Command", items: { length: 11 } }]);
});

test.fixme("should shows commands filtered by prefix", async ({ page }) => {
  await page.console.show();
  await page.console.type("b");

  await expect
    .poll(() => page.console.getCompletion())
    .toMatchObject([
      {
        title: "Console Command",
        items: [{ text: "buffer" }, { text: "bdelete" }, { text: "bdeletes" }],
      },
    ]);
});

// > byffer
// > bdelete
// > bdeletes
// : b
test.fixme(
  "selects completion items by <Tab>/<S-Tab> keys",
  async ({ page }) => {
    await page.console.show();
    await page.console.type("b");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Console Command",
          items: [
            { text: "buffer", highlight: false },
            { text: "bdelete", highlight: false },
            { text: "bdeletes", highlight: false },
          ],
        },
      ]);
    await expect.poll(() => page.console.getCommand()).toBe("b");

    await page.keyboard.press("Tab");
    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Console Command",
          items: [
            { text: "buffer", highlight: true },
            { text: "bdelete", highlight: false },
            { text: "bdeletes", highlight: false },
          ],
        },
      ]);
    await expect.poll(() => page.console.getCommand()).toBe("buffer");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Console Command",
          items: [
            { text: "buffer", highlight: false },
            { text: "bdelete", highlight: false },
            { text: "bdeletes", highlight: true },
          ],
        },
      ]);
    await expect.poll(() => page.console.getCommand()).toBe("bdeletes");

    await page.keyboard.press("Tab");
    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Console Command",
          items: [
            { text: "buffer", highlight: false },
            { text: "bdelete", highlight: false },
            { text: "bdeletes", highlight: false },
          ],
        },
      ]);
    await expect.poll(() => page.console.getCommand()).toBe("b");

    await page.keyboard.press("Shift+Tab");
    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Console Command",
          items: [
            { text: "buffer", highlight: false },
            { text: "bdelete", highlight: false },
            { text: "bdeletes", highlight: true },
          ],
        },
      ]);
    await expect.poll(() => page.console.getCommand()).toBe("bdeletes");
  },
);
