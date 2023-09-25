import { test, expect } from "./lib/fixture";
import { newServer, staticContentHandler } from "./lib/servers";

const server = newServer([
  {
    url: "/pagination-a/:page",
    handler: (req, reply) => {
      reply.type("text/html").send(`<!DOCTYPE html>
<html lang="en">
  <a href="/pagination-a/${Number(req.params["page"]) - 1}">prev</a>
  <a href="/pagination-a/${Number(req.params["page"]) + 1}">next</a>
</html>`);
    },
  },
  {
    url: "/pagination-link/:page",
    handler: (req, reply) => {
      reply.type("text/html").send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="prev" href="/pagination-link/${
      Number(req.params["page"]) - 1
    }"></link>
    <link rel="next" href="/pagination-link/${
      Number(req.params["page"]) + 1
    }"></link>
  </head>
</html>`);
    },
  },
  {
    url: "/reload",
    handler: staticContentHandler(`<!DOCTYPE html>
<html lang="en">
  <body style="width:1000px; height:1000px"></body>
</html>`),
  },
]);

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("should go to parent path without hash by gu", async ({ page }) => {
  await page.goto(server.url("/a/b/c"));
  await page.keyboard.type("gu");

  await expect.poll(() => new URL(page.url()).pathname).toBe("/a/b/");
});

test("should remove hash by gu", async ({ page }) => {
  await page.goto(server.url("/a/b/c") + "#hash");
  await page.keyboard.type("gu");

  await expect.poll(() => new URL(page.url()).pathname).toBe("/a/b/c");
});

test("should go to root path by gU", async ({ page }) => {
  await page.goto(server.url("/a/b/c#hash"));
  await page.keyboard.press("g");
  await page.keyboard.press("Shift+U");

  await expect.poll(() => new URL(page.url()).pathname).toBe("/");
});

test("should go back and forward in history by H and L", async ({ page }) => {
  await page.goto(server.url("/first"));
  await page.goto(server.url("/second"));

  await page.keyboard.press("Shift+H");
  await expect.poll(() => new URL(page.url()).pathname).toBe("/first");

  await page.keyboard.press("Shift+L");
  await expect.poll(() => new URL(page.url()).pathname).toBe("/second");
});

test("should transit next/prev page in <a> by [[/]]", async ({ page }) => {
  await page.goto(server.url("/pagination-a/10"));

  await page.keyboard.type("[[");
  await expect.poll(() => new URL(page.url()).pathname).toBe("/pagination-a/9");

  await page.keyboard.type("]]");
  await expect
    .poll(() => new URL(page.url()).pathname)
    .toBe("/pagination-a/10");
});

test("should transit next/prev page in <link> by [[/]]", async ({ page }) => {
  await page.goto(server.url("/pagination-link/10"));

  await page.keyboard.type("[[");
  await expect
    .poll(() => new URL(page.url()).pathname)
    .toBe("/pagination-link/9");

  await page.keyboard.type("]]");
  await expect
    .poll(() => new URL(page.url()).pathname)
    .toBe("/pagination-link/10");
});

test("should go to home page into current tab by gh", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await page.goto("https://example.com");
  await page.keyboard.type("gh");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: "about:blank" }]);
});

test("should go to home page into current tab by gH", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await page.goto(server.url());
  await page.keyboard.press("g");
  await page.keyboard.press("Shift+H");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: server.url() }, { url: "about:blank" }]);
});

test("should reload by r", async ({ page }) => {
  await page.goto(server.url("/reload"));
  const before = await page.evaluate(
    () => window.performance.timing.navigationStart,
  );

  await page.keyboard.press("r");
  await expect
    .poll(() => page.evaluate(() => window.performance.timing.navigationStart))
    .toBeGreaterThan(before);
});

test("should hard reload by R", async ({ page }) => {
  await page.goto(server.url("/reload"));
  await page.evaluate(() => window.scrollBy(0, 100));

  const before = await page.evaluate(() => window.pageYOffset);
  expect(before).toBe(100);

  await page.keyboard.press("Shift+R");
  await expect.poll(() => page.evaluate(() => window.pageYOffset)).toBe(0);
});
