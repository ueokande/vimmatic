import { Sender } from "../../../src/messaging/handler/Sender";
import { describe, vi, test, expect } from "vitest";

type Schema = {
  greeting: {
    Request: { lang: string };
    Response: string;
  };
};

describe("Sender", () => {
  const handler = vi.fn();
  handler.mockImplementation(
    async (name: string, { lang }: { lang: string }) => {
      switch (name) {
        case "greeting":
          switch (lang) {
            case "en":
              return "hello";
            case "du":
              return "hallo";
          }
          throw new Error("unsupported language");
      }
      throw new Error("unsupported message");
    },
  );

  const sut = new Sender<Schema>(handler);

  test("it receives and route a message", async () => {
    await expect(sut.send("greeting", { lang: "en" })).resolves.toBe("hello");
    await expect(sut.send("greeting", { lang: "du" })).resolves.toBe("hallo");
    await expect(sut.send("greeting", { lang: "it" })).rejects.toThrow(
      "unsupported language",
    );
  });
});
