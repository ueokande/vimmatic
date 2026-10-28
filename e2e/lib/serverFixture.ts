import type { SiteProfile } from "../site/routes";
import { routesFor } from "../site/routes";
import { test as base } from "./fixture";
import type { Server } from "./servers";
import { createTestServer } from "./servers";

type Site = Pick<Server, "url">;
type WorkerFixtures = { server: Site; siteProfile: SiteProfile };

export const test = base.extend<object, WorkerFixtures>({
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
