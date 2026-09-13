import { describe, expect, test, vi } from "vitest";
import { OpenCommandHintAction } from "../../../src/background/hint/OpenCommandHintAction";
import { MockConsoleClient } from "../mock/MockConsoleClient";
import { MockHintClient } from "../mock/MockHintClient";

describe("OpenCommandHintAction", () => {
  const hintClient = new MockHintClient();
  const consoleClient = new MockConsoleClient();
  const sut = new OpenCommandHintAction(hintClient, consoleClient);

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
      "open https://example.com/photo.jpg",
    );
  });
});
