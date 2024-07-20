import { test, expect } from "./lib/fixture";
import * as clipboard from "./lib/clipboard";
import { SettingRepository } from "./lib/SettingRepository";
import { newNopServer } from "./lib/servers";

const server = newNopServer();

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("should copy current URL by y", async ({ page }) => {
  await page.goto(server.url());
  await page.keyboard.press("y");

  await expect.poll(() => clipboard.read()).toBe(server.url());
});

test("should open an URL from clipboard by p", async ({ page }) => {
  await page.goto(server.url());
  await clipboard.write(`${server.url()}#open_to_new_tab`);
  await page.keyboard.press("p");

  await expect.poll(() => page.url()).toBe(`${server.url()}#open_to_new_tab`);
});

test("should open an URL from clipboard to new tab by P", async ({
  page,
  api,
}) => {
  await page.goto(server.url());

  await clipboard.write(`${server.url()}#open_to_new_tab`);
  await page.keyboard.press("Shift+P");

  await expect
    .poll(async () =>
      (await api.tabs.query({ currentWindow: true })).map((t) => t.url),
    )
    .toEqual(
      expect.arrayContaining([server.url(), `${server.url()}#open_to_new_tab`]),
    );
});

test("should open search result with keywords in clipboard by p", async ({
  page,
  api,
}) => {
  await new SettingRepository(api).save({
    search: {
      default: "localhost",
      engines: {
        localhost: `${server.url()}?q={}`,
      },
    },
  });
  await page.goto(server.url());

  await clipboard.write(`an apple`);
  await page.keyboard.press("p");

  await expect.poll(() => page.url()).toBe(`${server.url()}?q=an%20apple`);
});

test("should open search result with keywords in clipboard to new tab by P", async ({
  page,
  api,
}) => {
  await new SettingRepository(api).save({
    search: {
      default: "localhost",
      engines: {
        localhost: `${server.url()}?q={}`,
      },
    },
  });
  await page.goto(server.url());

  await clipboard.write(`an apple`);
  await page.keyboard.press("Shift+P");

  await expect
    .poll(async () =>
      (await api.tabs.query({ currentWindow: true })).map((t) => t.url),
    )
    .toEqual(
      expect.arrayContaining([server.url(), `${server.url()}?q=an%20apple`]),
    );
});
