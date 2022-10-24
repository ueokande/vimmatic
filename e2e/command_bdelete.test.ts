import { test, expect } from "./lib/fixture";
import { newNopServer } from "./lib/servers";

const server = newNopServer();

const setupTabs = async (api) => {
  const { id: windowId } = await api.windows.getCurrent();
  const tabs = [];
  for (let i = 1; i <= 4; i++) {
    const url = server.url(`/site${i}`);
    const pinned = i === 1 || i === 2;
    const active = false;
    const tab = await api.tabs.create({ windowId, url, active, pinned });
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

test("should delete an unpinned tab by bdelete command", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("bdelete site3");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("/site1") },
      { url: server.url("/site2") },
      { url: "about:blank" },
      { url: server.url("/site4") },
    ]);
});

test("should not delete an pinned tab by bdelete command by bdelete command", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("bdelete site1");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("/site1") },
      { url: server.url("/site2") },
      { url: "about:blank" },
      { url: server.url("/site3") },
      { url: server.url("/site4") },
    ]);
});

test("should show an error when no tabs are matched by bdelete command", async ({
  page,
  api,
}) => {
  await setupTabs(api);

  await page.console.exec("bdelete xyz");

  await expect
    .poll(() => page.console.getErrorMessage())
    .toBe("No matching buffer for xyz");
});

test("should show an error when more than one tabs are matched by bdelete command", async ({
  page,
  api,
}) => {
  await setupTabs(api);

  await page.console.exec("bdelete site");

  await expect
    .poll(() => page.console.getErrorMessage())
    .toBe("More than one match for site");
});

test("should delete tabs by bdelete! command", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("bdelete site4");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("/site1") },
      { url: server.url("/site2") },
      { url: "about:blank" },
      { url: server.url("/site3") },
    ]);

  await page.console.exec("bdelete! site2");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("/site1") },
      { url: "about:blank" },
      { url: server.url("/site3") },
    ]);
});

test("should delete tabs by bdeletes! command", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("bdeletes site4");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("/site1") },
      { url: server.url("/site2") },
      { url: "about:blank" },
      { url: server.url("/site3") },
    ]);

  await page.console.exec("bdelete! site2");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: server.url("/site1") },
      { url: "about:blank" },
      { url: server.url("/site3") },
    ]);
});
