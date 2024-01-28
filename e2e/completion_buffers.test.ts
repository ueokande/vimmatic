import { test, expect } from "./lib/fixture";
import { newDynamicTitleServer } from "./lib/servers";

const server = newDynamicTitleServer((req) => `Site ${req.url.slice(1)}`);

const setupTabs = async (api: typeof browser) => {
  const tabs = [];
  for (let i = 0; i < 4; ++i) {
    const url = server.url(`/site_${"abcd"[i]}`);
    const pinned = i === 0 || i === 1;
    const active = false;
    const tab = await api.tabs.create({ url, pinned, active });
    tabs.push(tab);
  }
  return tabs;
};

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test.fixme(
  'should all tabs by "buffer" command with empty params',
  async ({ page, api }) => {
    await setupTabs(api);
    await page.keyboard.press("Shift+J");
    await page.keyboard.press("Shift+K");
    await page.console.show();
    await page.console.type("buffer ");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Buffers",
          items: [
            { text: "1:   Site site_a" },
            { text: "2:   Site site_b" },
            { text: "3: % New Tab" },
            { text: "4: # Site site_c" },
            { text: "5:   Site site_d" },
          ],
        },
      ]);
  },
);

test.fixme(
  'should filter items with URLs by keywords on "buffer" command',
  async ({ page, api }) => {
    await setupTabs(api);
    await page.console.show();
    await page.console.type("buffer /site_b");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Buffers",
          items: [{ text: "2:   Site site_b" }],
        },
      ]);
  },
);

test.fixme(
  'should filter items with titles by keywords on "buffer" command',
  async ({ page, api }) => {
    await setupTabs(api);
    await page.console.show();
    await page.console.type("buffer Site");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Buffers",
          items: [
            { text: "1:   Site site_a" },
            { text: "2:   Site site_b" },
            { text: "4:   Site site_c" },
            { text: "5:   Site site_d" },
          ],
        },
      ]);
  },
);

test.fixme(
  'should show one item by number on "buffer" command',
  async ({ page, api }) => {
    await setupTabs(api);
    await page.console.show();
    await page.console.type("buffer 2");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Buffers",
          items: [{ text: "2:   Site site_b" }],
        },
      ]);
  },
);

test.fixme(
  'should show only unpinned tabs "bdelete" command',
  async ({ page, api }) => {
    await setupTabs(api);
    await page.console.show();
    await page.console.type("bdelete Site");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Buffers",
          items: [{ text: "4:   Site site_c" }, { text: "5:   Site site_d" }],
        },
      ]);
  },
);

test.fixme(
  'should show only unpinned tabs "bdeletes" command',
  async ({ page, api }) => {
    await setupTabs(api);
    await page.console.show();
    await page.console.type("bdeletes Site");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Buffers",
          items: [{ text: "4:   Site site_c" }, { text: "5:   Site site_d" }],
        },
      ]);
  },
);

test.fixme(
  'should show both pinned and unpinned tabs "bdelete!" command',
  async ({ page, api }) => {
    await setupTabs(api);
    await page.console.show();
    await page.console.type("bdelete! Site");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Buffers",
          items: [
            { text: "1:   Site site_a" },
            { text: "2:   Site site_b" },
            { text: "4:   Site site_c" },
            { text: "5:   Site site_d" },
          ],
        },
      ]);
  },
);

test.fixme(
  'should show both pinned and unpinned tabs "bdeletes!" command',
  async ({ page, api }) => {
    await setupTabs(api);
    await page.console.show();
    await page.console.type("bdelete! Site");

    await expect
      .poll(() => page.console.getCompletion())
      .toMatchObject([
        {
          title: "Buffers",
          items: [
            { text: "1:   Site site_a" },
            { text: "2:   Site site_b" },
            { text: "4:   Site site_c" },
            { text: "5:   Site site_d" },
          ],
        },
      ]);
  },
);
