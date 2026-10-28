import { gotoWithExtension } from "./lib/readiness";
import { expect, test } from "./lib/serverFixture";

test.use({ siteProfile: "editor" });

for (const path of ["/designmode", "/contenteditable"]) {
  test(`types text into an iframe rich text editor (${path})`, async ({
    server,
    page,
  }) => {
    await gotoWithExtension(page, server.url(path));
    const frame = page.frameLocator("iframe[name=editor]");
    await expect(frame.locator("body[data-editor-ready=true]")).toBeAttached();
    if (path === "/designmode") {
      await expect
        .poll(() =>
          frame
            .locator("body")
            .evaluate((body) => body.ownerDocument.designMode),
        )
        .toBe("on");
    }
    await expect(
      frame.locator("head[data-vimmatic-content-status=ready]"),
    ).toBeAttached();

    await frame.locator("body").evaluate((body) => {
      const events: {
        key: string;
        prevented: boolean;
        target: string | undefined;
      }[] = [];
      body.ownerDocument.addEventListener(
        "keydown",
        (event) => {
          setTimeout(() => {
            events.push({
              key: event.key,
              prevented: event.defaultPrevented,
              target: (event.target as Element)?.tagName,
            });
            body.dataset.keyEvents = JSON.stringify(events);
          });
        },
        true,
      );
    });
    await frame.locator("body").click();
    await expect(page.locator("iframe[name=editor]")).toBeFocused();
    // pressSequentially refocuses the body and can clear Firefox's
    // designMode caret. Preserve the selection established by the click.
    await page.keyboard.type("jkG");

    try {
      await expect.poll(() => frame.locator("body").textContent()).toBe("jkG");
    } catch (error) {
      const state = await frame.locator("body").evaluate((body) => ({
        mode: body.ownerDocument.designMode,
        editable: body instanceof HTMLElement && body.isContentEditable,
        active: body.ownerDocument.activeElement?.tagName,
        selection: body.ownerDocument.getSelection()?.anchorNode?.nodeName,
        events: body.dataset.keyEvents,
      }));
      await test.info().attach("editor-input", {
        body: JSON.stringify(state),
        contentType: "application/json",
      });
      throw error;
    }
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
}

test("types text into an input in shadow DOM", async ({ server, page }) => {
  await gotoWithExtension(page, server.url("/shadow"));

  await page.locator("#input").click();
  await page.keyboard.type("jkG");

  await expect(page.locator("#input")).toHaveValue("jkG");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
