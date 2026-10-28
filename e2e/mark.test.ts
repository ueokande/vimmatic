import { expect } from "./lib/fixture";
import { newTab } from "./lib/newTab";
import { requiredId } from "./lib/requiredId";
import { withServer } from "./lib/serverFixture";
import { newScrollableServer } from "./lib/servers";

const test = withServer(() => newScrollableServer());

test("sets a local mark and jumps to it", async ({ server, page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.keyboard.type("ma");
  await expect(
    page
      .frameLocator("#vimmatic-console-frame")
      .getByText("Set local mark to 'a'", { exact: true }),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.keyboard.type("'a");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(200);
});

test("jumps to a global mark in an existing tab", async ({
  server,
  page,
  context,
  api,
}) => {
  await page.goto(server.url("/#first"));
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.keyboard.type("mA");
  await expect(
    page
      .frameLocator("#vimmatic-console-frame")
      .getByText("Set global mark to 'A'", { exact: true }),
  ).toBeVisible();
  const other = await newTab(context, api, page, server.url("/#second"));
  await other.bringToFront();
  await other.keyboard.type("'A");
  await expect
    .poll(
      async () =>
        (await api.tabs.query({ active: true, currentWindow: true }))[0]?.url,
    )
    .toBe(server.url("/#first"));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(200);
});

test("recreates a closed tab for a global mark", async ({
  server,
  page,
  context,
  api,
}) => {
  await page.goto(server.url("/#first"));
  const [original] = await api.tabs.query({
    active: true,
    currentWindow: true,
  });
  const originalId = requiredId(original?.id);
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.keyboard.type("mA");
  await expect(
    page
      .frameLocator("#vimmatic-console-frame")
      .getByText("Set global mark to 'A'", { exact: true }),
  ).toBeVisible();
  const other = await newTab(context, api, page, server.url("/#second"));
  await page.close();
  await other.bringToFront();
  await other.keyboard.type("'A");
  await expect
    .poll(async () => {
      const [active] = await api.tabs.query({
        active: true,
        currentWindow: true,
      });
      return { url: active?.url, recreated: active?.id !== originalId };
    })
    .toEqual({ url: server.url("/#first"), recreated: true });
});
