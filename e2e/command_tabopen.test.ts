import { test, expect } from "./lib/fixture";
import { newNopServer } from "./lib/servers";
import SettingRepository from "./lib/SettingRepository";
import Settings from "../src/shared/settings/Settings";

const server = newNopServer();

const setupSearchEngines = async (api) => {
  await new SettingRepository(api).saveJSON(
    Settings.fromJSON({
      search: {
        default: "google",
        engines: {
          google: server.url("/google") + "?q={}",
          yahoo: server.url("/yahoo") + "?q={}",
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

test("should open default search for keywords by tabopen command", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupSearchEngines(api);
  await page.console.exec("tabopen an apple");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/google") + "?q=an%20apple" },
    ]);
});

test("should open certain search page for keywords by tabopen command", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupSearchEngines(api);
  await page.console.exec("tabopen yahoo an apple");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/yahoo") + "?q=an%20apple" },
    ]);
});

test("should open default engine with empty keywords by tabopen command", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupSearchEngines(api);
  await page.console.exec("tabopen");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/google") + "?q=" },
    ]);
});

test("should open certain search page for empty keywords by tabopen command", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupSearchEngines(api);
  await page.console.exec("tabopen yahoo");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([
      { url: "about:blank" },
      { url: server.url("/yahoo") + "?q=" },
    ]);
});

test("should open a site with domain by tabopen command", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupSearchEngines(api);
  await page.console.exec("tabopen example.com");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: "about:blank" }, { url: "http://example.com/" }]);
});

test("should open a site with URL by tabopen command", async ({
  page,
  api,
}) => {
  const { id: windowId } = await api.windows.getCurrent();
  await setupSearchEngines(api);
  await page.console.exec("tabopen https://example.com");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: "about:blank" }, { url: "https://example.com/" }]);
});
