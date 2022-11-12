import Sender from "../../../src/messaging/handler/Sender";

type Schema = {
  greeting: {
    Request: { lang: string };
    Response: string;
  };
};

describe("Sender", () => {
  const handler = jest.fn();
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
    }
  );

  const sut = new Sender<Schema>(handler);

  test.only("it receives and route a message", async () => {
    await expect(sut.send("greeting", { lang: "en" })).resolves.toBe("hello");
    await expect(sut.send("greeting", { lang: "du" })).resolves.toBe("hallo");
    await expect(sut.send("greeting", { lang: "it" })).rejects.toThrowError(
      "unsupported language"
    );
  });
});
