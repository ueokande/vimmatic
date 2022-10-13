import { test, expect } from "./lib/fixture";
import TestServer from "./lib/TestServer";

const server = new TestServer().handle("/*", (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>site_${req.path.slice(1)}</title>
        </head>
      </html>`);
});

const setupTabs = async (api) => {
  const { id: windowId } = await api.windows.getCurrent();
  const tabs = [];
  for (let i = 1; i <= 3; i++) {
    const url = server.url(`/${i}`);
    const active = false;
    const tab = await api.tabs.create({ windowId, url, active });
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

test("should do nothing by buffer command with no parameters", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("buffer");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank", active: true },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/3") },
    ]);
});

test("should select a tab by buffer command with a number", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("buffer 3");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2"), active: true },
      { url: server.url("/3") },
    ]);
});

test("should should an out of range error by buffer commands", async ({
  page,
  api,
}) => {
  await setupTabs(api);

  await page.console.exec("buffer 0");
  await expect
    .poll(() => page.console.getErrorMessage())
    .toBe("tab 0 does not exist");

  await page.console.exec("buffer 9");
  await expect
    .poll(() => page.console.getErrorMessage())
    .toBe("tab 9 does not exist");
});

test("should select a tab by buffer command with a title", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("buffer site_1");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1"), active: true },
      { url: server.url("/2") },
      { url: server.url("/3") },
    ]);
});

test("should select a tab by buffer command with an URL", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("buffer /1");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1"), active: true },
      { url: server.url("/2") },
      { url: server.url("/3") },
    ]);
});

test.fixme("should select tabs rotately", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("buffer site");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1"), active: true },
      { url: server.url("/2") },
      { url: server.url("/3") },
    ]);

  await page.console.exec("buffer site");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1") },
      { url: server.url("/2"), active: true },
      { url: server.url("/3") },
    ]);
});

test('should do nothing by ":buffer %"', async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("buffer %");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank", active: true },
      { url: server.url("/1") },
      { url: server.url("/2") },
      { url: server.url("/3") },
    ]);
});

test('should selects last selected tab by ":buffer #"', async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.keyboard.press("Shift+J");
  await page.keyboard.press("Shift+K");
  await page.console.exec("buffer #");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/1"), active: true },
      { url: server.url("/2") },
      { url: server.url("/3") },
    ]);
});
