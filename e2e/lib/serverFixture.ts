import type { ConsoleMessage, Page } from "@playwright/test";
import type { SiteProfile } from "../site/routes";
import { routesFor } from "../site/routes";
import { attachDiagnostics } from "./diagnostics";
import { test as base } from "./fixture";
import type { Server } from "./servers";
import { createTestServer } from "./servers";

type Site = Pick<Server, "url" | "requests">;
type WorkerFixtures = { server: Site; siteProfile: SiteProfile };

export const test = base.extend<{ diagnostics: void }, WorkerFixtures>({
  diagnostics: [
    async ({ page, api, server }, use, info) => {
      const context = page.context();
      const since = Date.now();
      const errors: string[] = [];
      const remember = (message: string) => {
        errors.push(message);
        if (errors.length > 50) errors.shift();
      };
      const onError = (error: Error) => remember(String(error));
      const onConsole = (message: ConsoleMessage) => {
        if (["error", "warning"].includes(message.type()))
          remember(`${message.type()}: ${message.text()}`);
      };
      const observed = new Set<Page>();
      const observe = (target: Page) => {
        observed.add(target);
        target.on("pageerror", onError);
        target.on("console", onConsole);
      };
      context.pages().forEach(observe);
      context.on("page", observe);
      try {
        await use();
      } finally {
        context.off("page", observe);
        for (const target of observed) {
          target.off("pageerror", onError);
          target.off("console", onConsole);
        }
        if (info.status !== info.expectedStatus)
          await attachDiagnostics(info, context, api, server, since, errors);
      }
    },
    { auto: true, timeout: 5_000 },
  ],
  siteProfile: ["empty", { scope: "worker", option: true }],
  server: [
    async ({ siteProfile }, use) => {
      const server = createTestServer(routesFor(siteProfile));
      try {
        await server.start();
        await use(server);
      } finally {
        await server.stop();
      }
    },
    { scope: "worker" },
  ],
});

export { expect } from "./fixture";
