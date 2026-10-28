import type { FastifyReply, FastifyRequest } from "fastify";
import Fastify from "fastify";

export type ServedRequest = {
  at: number;
  method: string;
  url: string;
  status: number;
};

export interface Server {
  requests(): readonly ServedRequest[];

  start(): Promise<void>;

  stop(): Promise<void>;

  url(): string;

  url(path: string): string;
}

type HandlerFunc = (request: FastifyRequest, reply: FastifyReply) => unknown;
export type Route = {
  url: string;
  handler: HandlerFunc;
};

const staticContentHandler = (content: string): HandlerFunc => {
  return (_request, reply) => {
    reply.type("text/html").send(content);
  };
};

class TestServer {
  private address: string | undefined;

  private readonly recentRequests: ServedRequest[] = [];

  private readonly fastify = Fastify({});

  constructor(routes: Route[] = []) {
    this.fastify.addHook("onResponse", async (request, reply) => {
      this.recentRequests.push({
        at: Date.now(),
        method: request.method,
        url: request.url,
        status: reply.statusCode,
      });
      if (this.recentRequests.length > 100) this.recentRequests.shift();
    });
    routes.forEach((r) => {
      this.fastify.route({ method: "GET", ...r });
    });
  }

  requests(): readonly ServedRequest[] {
    return [...this.recentRequests];
  }

  async start(): Promise<void> {
    this.address = await this.fastify.listen({ host: "127.0.0.1", port: 0 });
  }

  async stop(): Promise<void> {
    this.address = undefined;
    await this.fastify.close();
  }

  url(path = "/"): string {
    if (typeof this.address === "undefined") {
      throw new Error("Server not started");
    }

    return new URL(path, this.address).toString();
  }
}

export const createTestServer = (routes: Route[]): Server =>
  new TestServer(routes);

export { staticContentHandler };
