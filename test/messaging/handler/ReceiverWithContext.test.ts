import ReceiverWithContext from "../../../src/messaging/handler/ReceiverWithContext";
import { describe, vi, test, expect } from "vitest";

type Schema = {
  greeting: {
    Request: string;
    Response: string;
  };
};

type Context = {
  id: number;
};

describe("Receiver", () => {
  const handler = vi.fn();
  handler.mockImplementation(async (ctx: Context, lang: string) => {
    switch (lang) {
      case "en":
        return `[${ctx.id}] hello`;
      case "du":
        return `[${ctx.id}] hallo`;
    }
    throw new Error("unsupported language");
  });

  const sut = new ReceiverWithContext<Schema, Context>();
  const ctx: Context = { id: 1 };

  test("it receives and route a message", async () => {
    sut.route("greeting").to(handler);

    await expect(sut.receive(ctx, "greeting", "en")).resolves.toBe("[1] hello");
    await expect(sut.receive(ctx, "greeting", "du")).resolves.toBe("[1] hallo");
    await expect(sut.receive(ctx, "greeting", "it")).rejects.toThrow(
      "unsupported language",
    );
  });

  test("it does nothing on unknown message", () => {
    expect(sut.receive(ctx, "ping" as any, {})).toBeUndefined();
  });
});
