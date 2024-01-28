import { test, expect } from "./lib/fixture";
import { newScrollableServer } from "./lib/servers";

const server = newScrollableServer();

test.beforeAll(async () => {
  await server.start();
});

test.afterAll(async () => {
  await server.stop();
});

test("should set a local mark and jump to it", async ({ page }) => {
  await page.goto(server.url());
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.keyboard.type("ma", { delay: 10 });
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.keyboard.type("'a", { delay: 10 });

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(200);
});

test.fixme(
  "should set a global mark and jump to it",
  async ({ context, api }) => {
    const { id: windowId } = await api.windows.getCurrent();

    const page1 = await context.newPage();
    const page2 = await context.newPage();
    await page1.goto(server.url("/global-mark#first"));
    await page2.goto(server.url("/global-mark#second"));
    const tabs = await api.tabs.query({ url: "*://*/global-mark" });
    await api.tabs.move(
      tabs.map((tab) => tab.id),
      { windowId, index: 0 },
    );

    await page1.evaluate(() => window.scrollBy(0, 200));
    await page1.keyboard.type("mA");
    await page1.evaluate(() => window.scrollBy(0, 500));
    await page1.keyboard.type("'A");
    await expect.poll(() => page1.evaluate(() => window.scrollY)).toBe(200);

    await page2.keyboard.type("'A");

    const [activeTab] = await api.tabs.query({ active: true, windowId });

    expect(activeTab.url).toBe(server.url("/global-mark#first"));
  },
);

test.fixme(
  "set a global mark and creates new tab from gone",
  async ({ context, api }) => {
    const page1 = await context.newPage();
    await page1.goto(server.url("/#first"));
    await page1.evaluate(() => window.scrollBy(0, 200));
    await page1.keyboard.type("mA");
    await page1.evaluate(() => window.scrollBy(0, 500));
    await page1.keyboard.type("'A");
    const [currentTab1] = await api.tabs.query({ active: true });
    await page1.close();

    const page2 = await context.newPage();
    await page2.goto(server.url("/#second"));
    await page2.keyboard.type("'A");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const [currentTab2] = await api.tabs.query({ active: true });

    expect(currentTab1.id).not.toBe(currentTab2.id);
    expect(new URL(currentTab2.url).hash).toBe("#first");
    expect(currentTab2.url).toBe(server.url("/#first"));
  },
);
