import { test, expect } from "./lib/fixture";
import TestServer from "./lib/TestServer";
import SettingRepository from "./lib/SettingRepository";
import Settings from "../src/shared/settings/Settings";

const server = new TestServer()
  .receiveContent("/google", "google")
  .receiveContent("/yahoo", "yahoo");
const setupSearchEngines = async (api) => {
  await new SettingRepository(api).saveJSON(
    Settings.fromJSON({
      search: {
        default: "google",
        engines: {
          google: server.url("/google?q={}"),
          yahoo: server.url("/yahoo?q={}"),
        },
      },
    })
  );
};

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test.fixme(
  "should open default search for keywords by winopen command",
  async ({ page, api }) => {
    await setupSearchEngines(api);
    await page.console.exec("winopen an apple");

    await expect.poll(() => api.windows.getAll()).toHaveLength(2);
    const [, win1] = await api.windows.getAll();
    const tabs = await api.tabs.query({ windowId: win1.id });
    expect(tabs[0].url).toBe(server.url("/google?q=an%20apple"));
  }
);

// Playwright cannot handle multiple windows
test.fixme(
  "should open certain search page for keywords by winopen command",
  async ({ page, api }) => {
    await setupSearchEngines(api);
    await page.console.exec("winopen yahoo an apple");

    await expect.poll(() => api.windows.getAll()).toHaveLength(2);
    const [, win1] = await api.windows.getAll();
    const tabs = await api.tabs.query({ windowId: win1.id });
    expect(tabs[0].url).toBe(server.url("/yahoo?q=an%20apple"));
  }
);

test.fixme(
  "should open default engine with empty keywords by winopen command",
  async ({ page, api }) => {
    await setupSearchEngines(api);
    await page.console.exec("winopen");

    await expect.poll(() => api.windows.getAll()).toHaveLength(2);
    const [, win1] = await api.windows.getAll();
    const tabs = await api.tabs.query({ windowId: win1.id });
    expect(tabs[0].url).toBe(server.url("/google?q=an%20apple"));
  }
);

test.fixme(
  "should open certain search page for empty keywords by winopen command",
  async ({ page, api }) => {
    await setupSearchEngines(api);
    await page.console.exec("winopen yahoo");

    await expect.poll(() => api.windows.getAll()).toHaveLength(2);
    const [, win1] = await api.windows.getAll();
    const tabs = await api.tabs.query({ windowId: win1.id });
    expect(tabs[0].url).toBe(server.url("/google?q=an%20apple"));
  }
);

test.fixme(
  "should open a site with domain by winopen command",
  async ({ page, api }) => {
    await setupSearchEngines(api);
    await page.console.exec("winopen example.com");

    await expect.poll(() => api.windows.getAll()).toHaveLength(2);
    const [, win1] = await api.windows.getAll();
    const tabs = await api.tabs.query({ windowId: win1.id });
    expect(tabs[0].url).toBe(server.url("http://example.com"));
  }
);

test.fixme(
  "should open a site with URL by winopen command",
  async ({ page, api }) => {
    await setupSearchEngines(api);
    await page.console.exec("winopen https://example.com");

    await expect.poll(() => api.windows.getAll()).toHaveLength(2);
    const [, win1] = await api.windows.getAll();
    const tabs = await api.tabs.query({ windowId: win1.id });
    expect(tabs[0].url).toBe(server.url("https://example.com"));
  }
);
