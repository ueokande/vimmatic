import YankURLHintAction from "../../../src/background/hint/YankURLHintAction";
import MokcHintClient from "../mock/MockHintClient";
import MockConsoleClient from "../mock/MockConsoleClient";
import MockClipboardRepository from "../mock/MockClipboardRepository";
import { describe, test, vi, expect } from "vitest";

describe("YankURLHintAction", () => {
  const hintClient = new MokcHintClient();
  const clipboardRepository = new MockClipboardRepository();
  const consoleClient = new MockConsoleClient();
  const sut = new YankURLHintAction(
    hintClient,
    clipboardRepository,
    consoleClient,
  );

  test("yank link url", async () => {
    const mockClipboardWrite = vi
      .spyOn(clipboardRepository, "write")
      .mockResolvedValue();
    const mockConsoleShowInfo = vi
      .spyOn(consoleClient, "showInfo")
      .mockResolvedValue();
    vi.spyOn(hintClient, "getElement").mockResolvedValue({
      tagName: "a",
      href: "https://example.com/photo.jpg",
      attributes: {},
    });

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockClipboardWrite).toHaveBeenCalledWith(
      "https://example.com/photo.jpg",
    );
    expect(mockConsoleShowInfo).toHaveBeenCalledWith(
      10,
      "Yanked https://example.com/photo.jpg",
    );
  });
});
