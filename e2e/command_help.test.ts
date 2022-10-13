import { test, expect } from "./lib/fixture";

test("should open help page by help command", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await page.console.exec("help");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: "https://ueokande.github.io/vimmatic/" },
    ]);
});
