import { test, expect } from "./lib/fixture";
import TestServer from "./lib/TestServer";

const server = new TestServer().handle("/*", (req, res) => {
  res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Site ${req.path.slice(1)}</title>
  </head>
</html>`);
});

const setupTabs = async (api) => {
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

test('should all tabs by "buffer" command with empty params', async ({
  page,
  api,
}) => {
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
});

test('should filter items with URLs by keywords on "buffer" command', async ({
  page,
  api,
}) => {
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
});

test('should filter items with titles by keywords on "buffer" command', async ({
  page,
  api,
}) => {
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
});

test('should show one item by number on "buffer" command', async ({
  page,
  api,
}) => {
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
});

test('should show only unpinned tabs "bdelete" command', async ({
  page,
  api,
}) => {
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
});

test('should show only unpinned tabs "bdeletes" command', async ({
  page,
  api,
}) => {
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
});

test('should show both pinned and unpinned tabs "bdelete!" command', async ({
  page,
  api,
}) => {
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
});

test('should show both pinned and unpinned tabs "bdeletes!" command', async ({
  page,
  api,
}) => {
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
});
