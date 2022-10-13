import { test, expect } from "./lib/fixture";
import TestServer from "./lib/TestServer";

const server = new TestServer().receiveContent(
  "/happy",
  `<!DOCTYPE html>
<html lang="en"><head><title>how to be happy</title></head></html>`
);

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("should add a bookmark from the current page", async ({ api, page }) => {
  await page.goto(server.url("/happy"));
  await page.console.exec("addbookmark how to be happy");

  await expect
    .poll(() => api.bookmarks.search({ title: "how to be happy" }))
    .toMatchObject([{ title: "how to be happy", url: server.url("/happy") }]);
});
