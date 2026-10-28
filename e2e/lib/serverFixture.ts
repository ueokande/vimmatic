import { test as base } from "./fixture";
import type { Server } from "./servers";

type Site = Pick<Server, "url">;

export const withServer = (createServer: () => Server) =>
  base.extend<object, { server: Site }>({
    server: [
      async ({ browserName: _ }, use) => {
        const server = createServer();
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
