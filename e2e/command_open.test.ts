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

test("should open default search for keywords by open command", async ({
  page,
  api,
}) => {
  await setupSearchEngines(api);
  await page.reload();
  await page.console.exec("open an apple");

  await expect
    .poll(() => page.url())
    .toBe(server.url("/google") + "?q=an%20apple");
});

test("should open certain search page for keywords by open command", async ({
  page,
  api,
}) => {
  await setupSearchEngines(api);
  await page.reload();
  await page.console.exec("open yahoo an apple");

  await expect
    .poll(() => page.url())
    .toBe(server.url("/yahoo") + "?q=an%20apple");
});

test("should open default engine with empty keywords by open command", async ({
  page,
  api,
}) => {
  await setupSearchEngines(api);
  await page.reload();
  await page.console.exec("open");

  await expect.poll(() => page.url()).toBe(server.url("/google") + "?q=");
});

test("should open certain search page for empty keywords by open command", async ({
  page,
  api,
}) => {
  await setupSearchEngines(api);
  await page.reload();
  await page.console.exec("open yahoo");

  await expect.poll(() => page.url()).toBe(server.url("/yahoo") + "?q=");
});

test("should open a site with domain by open command", async ({
  page,
  api,
}) => {
  await setupSearchEngines(api);
  await page.reload();
  await page.console.exec("open example.com");

  await expect.poll(() => page.url()).toBe("http://example.com/");
});

test("should open a site with URL by open command", async ({ page, api }) => {
  await setupSearchEngines(api);
  await page.reload();
  await page.console.exec("open http://example.com");

  await expect.poll(() => page.url()).toBe("http://example.com/");
});
