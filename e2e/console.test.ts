import { test, expect } from "./lib/fixture";

test.fixme("open console with :", async ({ page }) => {
  await page.console.show();

  await expect.poll(() => page.console.getCommand()).toBe("");
});

test.fixme("open console with open command by o", async ({ page }) => {
  await page.keyboard.press("o");

  await expect.poll(() => page.console.getCommand()).toBe("open ");
});

test.fixme(
  "open console with open command and current URL by O",
  async ({ page }) => {
    await page.keyboard.press("Shift+O");

    await expect.poll(() => page.console.getCommand()).toBe("open about:blank");
  },
);

test.fixme("open console with tabopen command by t", async ({ page }) => {
  await page.keyboard.press("t");

  await expect.poll(() => page.console.getCommand()).toBe("tabopen ");
});

test.fixme(
  "open console with tabopen command and current URL by T",
  async ({ page }) => {
    await page.keyboard.press("Shift+T");

    await expect
      .poll(() => page.console.getCommand())
      .toBe("tabopen about:blank");
  },
);

test.fixme("open console with winopen command by w", async ({ page }) => {
  await page.keyboard.press("w");

  await expect.poll(() => page.console.getCommand()).toBe("winopen ");
});

test.fixme(
  "open console with winopen command and current URL by W",
  async ({ page }) => {
    await page.keyboard.press("Shift+W");

    await expect
      .poll(() => page.console.getCommand())
      .toBe("winopen about:blank");
  },
);

test.fixme("open console with buffer command by b", async ({ page }) => {
  await page.keyboard.press("b");

  await expect.poll(() => page.console.getCommand()).toBe("buffer ");
});

test.fixme(
  "open console with addbookmark command with title by a",
  async ({ page }) => {
    await page.keyboard.press("a");

    await expect
      .poll(() => page.console.getCommand())
      .toBe("addbookmark New Tab");
  },
);
