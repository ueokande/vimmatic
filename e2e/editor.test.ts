import { expect, test } from "./lib/fixture";
import { newServer } from "./lib/servers";

const editorPage = (setup: string) => `<!DOCTYPE html>
<html lang="en"><body style="height:10000px">
<script>
  const iframe = document.createElement("iframe");
  iframe.name = "editor";
  iframe.style.width = "400px";
  iframe.style.height = "200px";
  iframe.addEventListener("load", () => {
    const doc = iframe.contentDocument;
    ${setup}
    doc.body.dataset.editorReady = "true";
  });
  document.body.prepend(iframe);
</script>
</body></html>`;

const server = newServer([
  {
    url: "/designmode",
    handler: (_req, reply) =>
      reply.type("text/html").send(editorPage(`doc.designMode = "on";`)),
  },
  {
    url: "/contenteditable",
    handler: (_req, reply) =>
      reply
        .type("text/html")
        .send(editorPage(`doc.body.setAttribute("contenteditable", "true");`)),
  },
  {
    url: "/shadow",
    handler: (_req, reply) =>
      reply.type("text/html").send(`<!DOCTYPE html>
<html lang="en"><body style="height:10000px">
<div id="host"></div>
<script>
  const root = document.getElementById("host").attachShadow({ mode: "open" });
  root.innerHTML = '<input id="input">';
</script>
</body></html>`),
  },
]);

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

for (const path of ["/designmode", "/contenteditable"]) {
  test(`types text into an iframe rich text editor (${path})`, {
    tag: "@smoke",
  }, async ({ page }) => {
    await page.goto(server.url(path));
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

test("types text into an input in shadow DOM", { tag: "@smoke" }, async ({
  page,
}) => {
  await page.goto(server.url("/shadow"));

  await page.locator("#input").click();
  await page.keyboard.type("jkG");

  await expect(page.locator("#input")).toHaveValue("jkG");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
