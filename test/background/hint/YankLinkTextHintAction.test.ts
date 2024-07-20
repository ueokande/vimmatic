import { YankLinkTextHintAction } from "../../../src/background/hint/YankLinkTextHintAction";
import { MockHintClient } from "../mock/MockHintClient";
import { MockConsoleClient } from "../mock/MockConsoleClient";
import { MockClipboardRepository } from "../mock/MockClipboardRepository";
import { describe, test, vi, expect } from "vitest";

describe("YankLinkTextHintAction", () => {
  const hintClient = new MockHintClient();
  const clipboardRepository = new MockClipboardRepository();
  const consoleClient = new MockConsoleClient();
  const sut = new YankLinkTextHintAction(
    hintClient,
    clipboardRepository,
    consoleClient,
  );

  test("yank link text", async () => {
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
      textContent: "my photo",
    });

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockClipboardWrite).toHaveBeenCalledWith("my photo");
    expect(mockConsoleShowInfo).toHaveBeenCalledWith(10, "Yanked my photo");
  });

  test("yank link text", async () => {
    const mockClipboardWrite = vi
      .spyOn(clipboardRepository, "write")
      .mockResolvedValue();
    const mockConsoleShowInfo = vi
      .spyOn(consoleClient, "showInfo")
      .mockResolvedValue();
    vi.spyOn(hintClient, "getElement").mockResolvedValue({
      tagName: "area",
      href: "https://example.com/photo.jpg",
      attributes: { alt: "my photo" },
    });

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockClipboardWrite).toHaveBeenCalledWith("my photo");
    expect(mockConsoleShowInfo).toHaveBeenCalledWith(10, "Yanked my photo");
  });

  test("no text", async () => {
    const mockConsoleShowError = vi
      .spyOn(consoleClient, "showError")
      .mockResolvedValue();
    vi.spyOn(hintClient, "getElement").mockResolvedValue({
      tagName: "area",
      href: "https://example.com/photo.jpg",
      attributes: {},
    });

    const target = { frameId: 0, element: "100", tag: "aa" };
    await sut.activate(10, target, { newTab: false, background: false });

    expect(mockConsoleShowError).toHaveBeenCalledWith(10, "No content to yank");
  });
});
