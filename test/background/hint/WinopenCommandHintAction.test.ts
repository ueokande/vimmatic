import WinopenCommandHintAction from "../../../src/background/hint/WinopenCommandHintAction";
import MokcHintClient from "../mock/MockHintClient";
import MockConsoleClient from "../mock/MockConsoleClient";

describe("WinopenCommandHintAction", () => {
  const hintClient = new MokcHintClient();
  const consoleClient = new MockConsoleClient();
  const sut = new WinopenCommandHintAction(hintClient, consoleClient);

  test("open link in the current tab", async () => {
    const mockShowCommand = jest
      .spyOn(consoleClient, "showCommand")
      .mockResolvedValue();
    jest.spyOn(hintClient, "getElement").mockResolvedValue({
      tagName: "a",
      href: "https://example.com/photo.jpg",
      attributes: {},
    });

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockShowCommand).toBeCalledWith(
      10,
      "winopen https://example.com/photo.jpg",
    );
  });
});
