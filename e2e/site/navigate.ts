import type { Route } from "../lib/servers";
import { htmlFile } from "./pages";

export const routes: Route[] = [
  {
    url: "/pagination-a/:page",
    handler: (req, reply) => {
      reply.type("text/html").send(`<!DOCTYPE html>
<html lang="en">
  <a href="/pagination-a/${Number((req.params as { page: string }).page) - 1}">prev</a>
  <a href="/pagination-a/${Number((req.params as { page: string }).page) + 1}">next</a>
</html>`);
    },
  },
  {
    url: "/pagination-link/:page",
    handler: (req, reply) => {
      reply.type("text/html").send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="prev" href="/pagination-link/${
      Number((req.params as { page: string }).page) - 1
    }"></link>
    <link rel="next" href="/pagination-link/${
      Number((req.params as { page: string }).page) + 1
    }"></link>
  </head>
</html>`);
    },
  },
  {
    url: "/reload",
    handler: htmlFile("reload.html"),
  },
  ...["/", "/a/b/c", "/a/b/", "/first", "/second", "/initial"].map((url) => ({
    url,
    handler: htmlFile("empty.html"),
  })),
];
