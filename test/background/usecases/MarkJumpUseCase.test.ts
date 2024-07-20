import { MarkJumpUseCase } from "../../../src/background/usecases/MarkJumpUseCase";
import { MockConsoleClient } from "../mock/MockConsoleClient";
import { MockContentMessageClient } from "../mock/MockContentMessageClient";
import { MockPropertySettings } from "../mock/MockPropertySettings";
import { MockMarkRepository } from "../mock/MockMarkRepository";
import { MarkHelper } from "../../../src/background/usecases/MarkHelper";
import { describe, beforeAll, it, vi, expect } from "vitest";

describe("MarkJumpUseCase", () => {
  const markRepository = new MockMarkRepository();
  const consoleClient = new MockConsoleClient();
  const contentMessageClient = new MockContentMessageClient();
  const propertySettings = new MockPropertySettings();
  const markHelper = new MarkHelper();
  const sut = new MarkJumpUseCase(
    markRepository,
    consoleClient,
    contentMessageClient,
    propertySettings,
    markHelper,
  );

  vi.spyOn(propertySettings, "getProperty").mockImplementation((name) => {
    if (name === "smoothscroll") {
      return Promise.resolve(true);
    }
    throw new Error("unexpected property");
  });

  beforeAll(() => {
    vi.spyOn(chrome.tabs, "query").mockResolvedValue([
      { id: 100, url: "https://example.com/" } as chrome.tabs.Tab,
    ]);
  });

  it("scrolls to global marks", async () => {
    const mockGetGlobalMark = vi
      .spyOn(markRepository, "getGlobalMark")
      .mockResolvedValue({
        tabId: 101,
        url: "https://example.com/",
        x: 10,
        y: 20,
      });
    const mockScrollTo = vi
      .spyOn(contentMessageClient, "scrollTo")
      .mockResolvedValue();
    const mockTabsUpdate = vi
      .spyOn(chrome.tabs, "update")
      .mockImplementation(() => Promise.resolve());

    await sut.jumpToMark("A");

    expect(mockGetGlobalMark).toHaveBeenCalledWith("A");
    expect(mockScrollTo).toHaveBeenCalledWith(101, 0, 10, 20, true);
    expect(mockTabsUpdate).toHaveBeenCalledWith(101, { active: true });
  });

  it("reopens tabs when the tab of the global mark is gone", async () => {
    const mockGetGlobalMark = vi
      .spyOn(markRepository, "getGlobalMark")
      .mockResolvedValue({
        tabId: 200,
        url: "https://example.com/",
        x: 10,
        y: 20,
      });
    const mockSetGlobalMark = vi
      .spyOn(markRepository, "setGlobalMark")
      .mockResolvedValue();
    const mockScrollTo = vi
      .spyOn(contentMessageClient, "scrollTo")
      .mockRejectedValue("tab not found");
    const mockTabsCreate = vi
      .spyOn(chrome.tabs, "create")
      .mockImplementation(() =>
        Promise.resolve({
          id: 201,
          url: "https://example.com/",
        }),
      );

    await sut.jumpToMark("A");

    expect(mockGetGlobalMark).toHaveBeenCalledWith("A");
    expect(mockScrollTo).toHaveBeenCalledWith(200, 0, 10, 20, true);
    expect(mockTabsCreate).toHaveBeenCalledWith({
      url: "https://example.com/",
    });
    expect(mockSetGlobalMark).toHaveBeenCalledWith("A", {
      tabId: 201,
      url: "https://example.com/",
      x: 10,
      y: 20,
    });
  });

  it("jumps to local marks", async () => {
    const mockGetLocalMark = vi
      .spyOn(markRepository, "getLocalMark")
      .mockResolvedValue({
        x: 10,
        y: 20,
      });
    const mockScrollTo = vi
      .spyOn(contentMessageClient, "scrollTo")
      .mockResolvedValue();

    await sut.jumpToMark("a");

    expect(mockGetLocalMark).toHaveBeenCalledWith(100, "a");
    expect(mockScrollTo).toHaveBeenCalledWith(100, 0, 10, 20, true);
  });

  it("show errors when global mark is not set", async () => {
    const mockShowError = vi
      .spyOn(consoleClient, "showError")
      .mockResolvedValue(undefined);
    vi.spyOn(markRepository, "getGlobalMark").mockResolvedValue(undefined);

    await sut.jumpToMark("A");

    expect(mockShowError).toHaveBeenCalledWith(100, "Mark is not set");
  });

  it("show errors when local mark is not set", async () => {
    const mockShowError = vi
      .spyOn(consoleClient, "showError")
      .mockResolvedValue(undefined);
    vi.spyOn(markRepository, "getLocalMark").mockResolvedValue(undefined);

    await sut.jumpToMark("A");

    expect(mockShowError).toHaveBeenCalledWith(100, "Mark is not set");
  });
});
