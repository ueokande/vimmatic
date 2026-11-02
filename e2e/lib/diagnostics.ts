import type { BrowserContext, TestInfo } from "@playwright/test";
import type { Server } from "./servers";

const capture = async (read: () => Promise<unknown>) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      read(),
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("Diagnostic timed out")),
          1_500,
        );
      }),
    ]);
  } catch (error) {
    return { error: String(error) };
  } finally {
    clearTimeout(timer);
  }
};

export const attachDiagnostics = async (
  info: TestInfo,
  context: BrowserContext,
  api: typeof browser,
  server: Pick<Server, "requests">,
  since: number,
  errors: string[],
) => {
  const [tabs, settings, local, pages] = await Promise.all([
    capture(() => api.tabs.query({})),
    capture(() => api.storage.sync.get("settings")),
    capture(() => api.storage.local.get()),
    Promise.all(
      context.pages().map(async (page) => ({
        url: page.url(),
        frames: await Promise.all(
          page.frames().map(async (frame) => ({
            url: frame.url(),
            state: await capture(() =>
              frame.evaluate(() => ({
                ready: document.readyState,
                content: document.head?.dataset.vimmaticContentStatus,
                console: document.head?.dataset.vimmaticConsoleStatus,
                focused: document.hasFocus(),
                active: document.activeElement?.tagName,
                activeId: document.activeElement?.id,
                scroll: { x: window.scrollX, y: window.scrollY },
              })),
            ),
          })),
        ),
      })),
    ),
  ]);
  await info.attach("e2e-state", {
    body: JSON.stringify(
      {
        tabs,
        settings,
        local,
        pages,
        errors,
        requests: server.requests().filter((request) => request.at >= since),
      },
      null,
      2,
    ),
    contentType: "application/json",
  });
};
