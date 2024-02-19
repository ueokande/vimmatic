import Receiver from "../../../src/messaging/handler/Receiver";

type Schema = {
  greeting: {
    Request: string;
    Response: string;
  };
};

describe("Receiver", () => {
  const handler = jest.fn();
  handler.mockImplementation(async (lang: string) => {
    switch (lang) {
      case "en":
        return "hello";
      case "du":
        return "hallo";
    }
    throw new Error("unsupported language");
  });

  const sut = new Receiver<Schema>();

  test("it receives and route a message", async () => {
    sut.route("greeting").to(handler);

    await expect(sut.receive("greeting", "en")).resolves.toBe("hello");
    await expect(sut.receive("greeting", "du")).resolves.toBe("hallo");
    await expect(sut.receive("greeting", "it")).rejects.toThrow(
      "unsupported language",
    );
  });

  test("it does nothing on unknown message", () => {
    expect(sut.receive("ping" as any, {})).toBeUndefined();
  });
});
