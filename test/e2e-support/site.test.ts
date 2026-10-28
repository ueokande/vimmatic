import Fastify from "fastify";
import { expect, it } from "vitest";
import type { SiteProfile } from "../../e2e/site/routes";
import { routesFor } from "../../e2e/site/routes";

const sites: [SiteProfile, string[]][] = [
  ["empty", ["/", "/site1", "/2?q=hello"]],
  ["scrollable", ["/", "/a", "/ab"]],
  ["find", ["/"]],
  ["hints", ["/"]],
  ["addon", ["/", "/frame"]],
  ["editor", ["/designmode", "/contenteditable", "/shadow"]],
  [
    "follow",
    [
      "/",
      "/hello",
      "/follow-input",
      "/area",
      "/test1",
      "/test2",
      "/test2-frame",
      "/test3",
      "/test3-frame",
    ],
  ],
  [
    "navigation",
    [
      "/",
      "/a/b/c",
      "/a/b/",
      "/first",
      "/second",
      "/initial",
      "/reload",
      "/pagination-a/10",
      "/pagination-link/10",
    ],
  ],
];

it.each(sites)(
  "serves the %s scenario pages as successful HTML",
  async (profile, urls) => {
    const app = Fastify();
    for (const route of routesFor(profile)) app.get(route.url, route.handler);
    try {
      for (const url of urls) {
        const response = await app.inject({ url });
        expect(response.statusCode, url).toBe(200);
        expect(response.headers["content-type"], url).toContain("text/html");
        expect(response.body, url).toMatch(/<!doctype html>/i);
      }
    } finally {
      await app.close();
    }
  },
);

it("reports unknown navigation pages instead of silently returning a blank document", async () => {
  const app = Fastify();
  for (const route of routesFor("navigation"))
    app.get(route.url, route.handler);
  try {
    expect((await app.inject({ url: "/typo" })).statusCode).toBe(404);
    const response = await app.inject({ url: "/pagination-a/10" });
    expect(response.body).toContain('href="/pagination-a/9"');
    expect(response.body).toContain('href="/pagination-a/11"');
  } finally {
    await app.close();
  }
});
