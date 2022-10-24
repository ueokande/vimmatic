import Fastify from "fastify";
import type { FastifyRequest, FastifyReply } from "fastify";

interface Server {
  start(): Promise<void>;

  stop(): Promise<void>;

  url(): string;

  url(path: string): string;
}

type HandlerFunc = (request: FastifyRequest, reply: FastifyReply) => unknown;
type Route = {
  url: string;
  handler: HandlerFunc;
};

const staticContentHandler = (content: string): HandlerFunc => {
  return (_request, reply) => {
    reply.type("text/html").send(content);
  };
};

const dynamicTitleHandler = (
  handler: (req: FastifyRequest) => string
): HandlerFunc => {
  return (request, reply) => {
    const title = handler(request);
    const content = `<!DOCTYPE html><html lang="en"><head><title>${title}</title></head></html>`;
    reply.type("text/html").send(content);
  };
};

class MockServer {
  private address: string | undefined;

  private readonly fastify = Fastify({});

  constructor(routes: Route[] = []) {
    routes.forEach((r) => this.fastify.route({ method: "GET", ...r }));
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

    const url = new URL(this.address);
    url.pathname = path;
    return url.toString();
  }
}

const newServer = (routes: Route[]): Server => {
  return new MockServer(routes);
};

const newNopServer = (): Server => {
  return new MockServer([]);
};

const newSingleContentServer = (content: string): Server => {
  const routes = [
    {
      url: "/*",
      handler: staticContentHandler(content),
    },
  ];
  return new MockServer(routes);
};

const newSingleTitleServer = (title: string): Server => {
  const content = `<!DOCTYPE html><html lang="en"><head>${title}<title></title></head></html>`;
  const routes = [
    {
      url: "/*",
      handler: staticContentHandler(content),
    },
  ];
  return new MockServer(routes);
};

const newScrollableServer = (): Server => {
  const content = `<!DOCTYPE html><html lang="en"><body style="width:10000px; height:10000px"></body></html>`;
  return newSingleContentServer(content);
};

const newSingleHandlerServer = (url: string, handler: HandlerFunc): Server => {
  const routes = [{ url, handler }];
  return new MockServer(routes);
};

const newDynamicTitleServer = (
  handler: (req: FastifyRequest) => string
): Server => {
  const routes = [
    {
      url: "/*",
      handler: dynamicTitleHandler(handler),
    },
  ];
  return new MockServer(routes);
};

export {
  MockServer,
  newServer,
  newNopServer,
  newSingleContentServer,
  newSingleTitleServer,
  newScrollableServer,
  newSingleHandlerServer,
  newDynamicTitleServer,
  staticContentHandler,
};
