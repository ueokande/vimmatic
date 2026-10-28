import type { Page } from "@playwright/test";
import { expect, test } from "./lib/fixture";
import { newTab } from "./lib/newTab";
import { newServer } from "./lib/servers";

const SCROLLABLE = `<!DOCTYPE html>
<html lang="en"><body tabindex="0" style="width:10000px; height:10000px"></body></html>`;

const server = newServer([
  {
    url: "/",
    handler: (_req, reply) => reply.type("text/html").send(SCROLLABLE),
  },
  {
    url: "/frame",
    handler: (_req, reply) =>
      reply.type("text/html").send(`<!DOCTYPE html>
<html lang="en"><body style="height:10000px">
  <iframe name="inner-frame" src="/" style="width:400px; height:400px"></iframe>
</body></html>`),
  },
]);

const CONSOLE_FRAME = "#vimmatic-console-frame";

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

const expectEnabled = async (page: Page, enabled: boolean) => {
  if (enabled) {
    await expect(page.locator(CONSOLE_FRAME)).toBeAttached();
  } else {
    await expect(page.locator(CONSOLE_FRAME)).not.toBeAttached();
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press("j");
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBe(enabled ? 64 : 0);
};

test("toggles the add-on only in the current tab", async ({
  page,
  context,
  api,
}) => {
  await page.goto(server.url("/"));
  await page.keyboard.press("Shift+Escape");
  await expectEnabled(page, false);

  const other = await newTab(context, api, page, server.url("/"));
  await expectEnabled(other, true);

  await page.bringToFront();
  await expectEnabled(page, false);

  await page.keyboard.press("Shift+Escape");
  await expectEnabled(page, true);
});

test("keeps the state after reload", async ({ page }) => {
  await page.goto(server.url("/"));
  await page.keyboard.press("Shift+Escape");
  await expectEnabled(page, false);

  await page.reload({ waitUntil: "load" });
  await expectEnabled(page, false);

  await page.keyboard.press("Shift+Escape");
  await expectEnabled(page, true);
});

test("applies the state to frames and toggles from a frame", async ({
  page,
}) => {
  await page.goto(server.url("/frame"));
  const frame = page.frameLocator("iframe[name='inner-frame']");
  const innerFrame = page.frame("inner-frame")!;
  const innerScrollY = () => innerFrame.evaluate(() => window.scrollY);

  await page.keyboard.press("Shift+Escape");
  await expectEnabled(page, false);

  await frame.locator("body").click({ position: { x: 10, y: 10 } });
  // Clicking may scroll the frame
  await innerFrame.evaluate(() => window.scrollTo(0, 0));
  await frame.locator("body").press("j");
  await page.waitForTimeout(500);
  expect(await innerScrollY()).toBe(0);

  // Shift+Esc in the frame enables the whole tab
  await frame.locator("body").press("Shift+Escape");
  await expect(page.locator(CONSOLE_FRAME)).toBeAttached();
  await frame.locator("body").press("j");
  await expect.poll(innerScrollY).toBe(64);
});

test("applies the disabled state to a frame loaded later", async ({ page }) => {
  await page.goto(server.url("/"));
  await page.keyboard.press("Shift+Escape");
  await expectEnabled(page, false);

  await page.evaluate((src) => {
    const iframe = document.createElement("iframe");
    iframe.name = "late-frame";
    iframe.src = src;
    iframe.style.width = "400px";
    iframe.style.height = "400px";
    document.body.prepend(iframe);
  }, server.url("/"));
  const frame = page.frameLocator("iframe[name='late-frame']");
  await frame.locator("body").waitFor();
  const lateFrame = page.frame("late-frame")!;
  // Wait for the content script in the frame to be initialized
  await expect(
    frame.locator("head[data-vimmatic-content-status='ready']"),
  ).toBeAttached();
  // The state is applied asynchronously after the frame becomes ready.
  await page.waitForTimeout(500);

  await frame.locator("body").click({ position: { x: 10, y: 10 } });
  // Clicking may scroll the frame
  await lateFrame.evaluate(() => window.scrollTo(0, 0));
  await frame.locator("body").press("j");
  await page.waitForTimeout(500);
  expect(await lateFrame.evaluate(() => window.scrollY)).toBe(0);
});
