import { expect, test } from "./lib/fixture";
import { newServer } from "./lib/servers";

const editorPage = (setup: string) => `<!DOCTYPE html>
<html lang="en"><body style="height:10000px">
<script>
  const iframe = document.createElement("iframe");
  iframe.name = "editor";
  iframe.style.width = "400px";
  iframe.style.height = "200px";
  document.body.prepend(iframe);
  const doc = iframe.contentDocument;
  doc.open();
  doc.write("<!DOCTYPE html><html><head></head><body></body></html>");
  doc.close();
  ${setup}
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
  test(`types text into an iframe rich text editor (${path})`, async ({
    page,
  }) => {
    await page.goto(server.url(path));
    const frame = page.frame("editor")!;
    // Wait for the content script in the frame to be initialized
    await page.waitForTimeout(500);

    await page.frameLocator("iframe[name='editor']").locator("body").click();
    await page.keyboard.type("jkG");

    await expect
      .poll(() => frame.evaluate(() => document.body.textContent))
      .toBe("jkG");
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
}

test("types text into an input in shadow DOM", async ({ page }) => {
  await page.goto(server.url("/shadow"));

  await page.locator("#input").click();
  await page.keyboard.type("jkG");

  await expect(page.locator("#input")).toHaveValue("jkG");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
