import { test, expect } from "./lib/fixture";
import { newServer, staticContentHandler } from "./lib/servers";

const server = newServer([
  {
    url: "/",
    handler: staticContentHandler(`<!DOCTYPE html>
<html lang="en"><body>
  <a href="hello">hello</a>
</body></html>`),
  },
  {
    url: "/follow-input",
    handler: staticContentHandler(`<!DOCTYPE html>
<html lang="en"><body>
  <input>
</body></html>`),
  },
  {
    url: "/area",
    handler: staticContentHandler(`<!DOCTYPE html>
<html lang="en"><body>
  <img
    width="256" height="256"  usemap="#map"
    src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
  >
  <map name="map">
    <area shape="rect" coords="0,0,64,64" href="/">
    <area shape="rect" coords="64,64,64,64" href="/">
    <area shape="rect" coords="128,128,64,64" href="/">
  </map>
</body></html>`),
  },
  {
    /*
     * test case: link2 is out of the viewport
     * +-----------------+
     * |   [link1]       |<--- window
     * |                 |
     * |=================|<--- viewport
     * |   [link2]       |
     * |                 |
     * +-----------------+
     */
    url: "/test1",
    handler: staticContentHandler(`<!DOCTYPE html>
<html lang="en"><body>
  <div><a href="link1">link1</a></div>
  <div style="min-height:3000px"></div>
  <div><a href="link2">link2</a></div>
</body></html>`),
  },
  {
    /*
     * test case 2: link2 and link3 are out of window of the frame
     * +-----------------+
     * | +-----------+   |
     * | | [link1]   |   |
     * |=================|
     * | | [link2]   |   |
     * | +-----------+   |
     * |                 |
     * +-----------------+
     */
    url: "/test2",
    handler: staticContentHandler(`<!DOCTYPE html>
    <html lang="en"><body>
      <iframe name="inner-frame" height="5000" src='/test2-frame'>
    </body></html>`),
  },
  {
    url: "/test2-frame",
    handler: staticContentHandler(`<!DOCTYPE html>
<html lang="en"><body>
  <div><a href="link1">link1</a></div>
  <div style="min-height:3000px"></div>
  <div><a href="link2">link2</a></div>
</body></html>`),
  },
  {
    /* test case 3: link2 is out of window of the frame
     * +-----------------+
     * | +-----------+   |
     * | | [link1]   |   |
     * | +-----------+   |
     * | : [link2]   :   |
     * | + - - - - - +   |
     * |                 |
     * +-----------------+
     */
    url: "/test3",
    handler: staticContentHandler(`<!DOCTYPE html>
<html lang="en"><body>
  <iframe name="inner-frame" src='/test3-frame'>
</body></html>`),
  },
  {
    url: "/test3-frame",
    handler: staticContentHandler(`<!DOCTYPE html>
<html lang="en"><body>
  <div><a href="link1">link1</a></div>
  <div style="min-height:3000px"></div>
  <div><a href="link2">link2</a></div>
</body></html>`),
  },
]);

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("should focus an input by f", async ({ page }) => {
  await page.goto(server.url("/follow-input"));
  await page.keyboard.press("f");
  await page.locator("text=a").waitFor();
  await page.keyboard.press("a");

  const activeTag = await page.evaluate(() => document.activeElement.tagName);
  expect(activeTag.toLowerCase()).toBe("input");
});

test("should open a link by f", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await page.goto(server.url());
  await page.keyboard.press("f");
  await page.locator("text=a").waitFor();
  await page.keyboard.press("a");
  await page.waitForNavigation();

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: server.url("/hello") }]);
});

test("should open a link to new tab by F", async ({ page, api }) => {
  const { id: windowId } = await api.windows.getCurrent();

  await page.goto(server.url());
  await page.keyboard.press("Shift+F");
  await page.locator("text=a").waitFor();
  await page.keyboard.press("a");

  await expect
    .poll(() => api.tabs.query({ windowId }))
    .toMatchObject([{ url: server.url() }, { url: server.url("/hello") }]);
});

test("should show hints of links in area", async ({ page }) => {
  await page.goto(server.url("/area"));
  await page.keyboard.press("f");
  await page.locator("text=a").waitFor();

  const hints = await page.locator(".vimmatic-hint").allInnerTexts();
  expect(hints.length).toBe(3);
});

test("should shows hints only in viewport", async ({ page }) => {
  await page.goto(server.url("/test1"));
  await page.keyboard.press("f");
  await page.locator("text=a").waitFor();

  const hints = await page.locator(".vimmatic-hint").allInnerTexts();
  expect(hints.length).toBe(1);
});

test("should shows hints only in window of the frame", async ({ page }) => {
  await page.goto(server.url("/test2"));
  await page.keyboard.press("f");
  await page.frame("inner-frame").locator("text=a").waitFor();

  const hints = await page
    .frame("inner-frame")
    .locator(".vimmatic-hint")
    .allInnerTexts();
  expect(hints.length).toBe(1);
});

test("should shows hints only in the frame", async ({ page }) => {
  await page.goto(server.url("/test3"));
  await page.keyboard.press("f");
  await page.frame("inner-frame").locator("text=a").waitFor();

  const hints = await page
    .frame("inner-frame")
    .locator(".vimmatic-hint")
    .allInnerTexts();
  expect(hints.length).toBe(1);
});
