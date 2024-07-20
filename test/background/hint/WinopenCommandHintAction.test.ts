import { WinopenCommandHintAction } from "../../../src/background/hint/WinopenCommandHintAction";
import { MockHintClient } from "../mock/MockHintClient";
import { MockConsoleClient } from "../mock/MockConsoleClient";
import { describe, test, expect, vi } from "vitest";

describe("WinopenCommandHintAction", () => {
  const hintClient = new MockHintClient();
  const consoleClient = new MockConsoleClient();
  const sut = new WinopenCommandHintAction(hintClient, consoleClient);

  test("open link in the current tab", async () => {
    const mockShowCommand = vi
      .spyOn(consoleClient, "showCommand")
      .mockResolvedValue();
    vi.spyOn(hintClient, "getElement").mockResolvedValue({
      tagName: "a",
      href: "https://example.com/photo.jpg",
      attributes: {},
    });

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockShowCommand).toHaveBeenCalledWith(
      10,
      "winopen https://example.com/photo.jpg",
    );
  });
});
