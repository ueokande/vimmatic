import { test, expect } from "./lib/fixture";

const setupTabs = async (api) => {
  const { id: windowId } = await api.windows.getCurrent();
  const tabs = [];
  for (let i = 1; i <= 3; i++) {
    const url = `about:blank#${i}`;
    const active = false;
    const tab = await api.tabs.create({ windowId, url, active });
    tabs.push(tab);
  }
  return tabs;
};

test.fixme("should current tab by q command", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("q");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#1" },
      { url: "about:blank#2" },
      { url: "about:blank#3" },
    ]);
});

test.fixme("should current tab by quit command", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("quit");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank#1" },
      { url: "about:blank#2" },
      { url: "about:blank#3" },
    ]);
});

test.fixme("should current tab by qa command", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("qa");

  await expect.poll(() => api.tabs.query({ windowId })).toHaveLength(0);
});

test.fixme("should current tab by quitall command", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupTabs(api);

  await page.console.exec("quitall");

  await expect.poll(() => api.tabs.query({ windowId })).toHaveLength(0);
});
