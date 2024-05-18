import HintKeyUseCaes from "../../../src/background/usecases/HintKeyUseCase";
import MockHintClient from "../mock/MockHintClient";
import MockHintRepository from "../mock/MockHintRepository";
import MockHintActionFactory from "../mock/MockHintActionFactory";
import type { HintAction } from "../../../src/background/hint/types";
import { describe, beforeEach, it, vi, expect } from "vitest";

class MockHintAction implements HintAction {
  constructor() {}

  lookupTargetSelector(): string {
    return "[mock]";
  }

  activate(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

describe("HintKeyUseCaes", () => {
  const hintClient = new MockHintClient();
  const hintRepository = new MockHintRepository();
  const hintActionFactory = new MockHintActionFactory();
  const mockAction = new MockHintAction();
  const sut = new HintKeyUseCaes(hintClient, hintRepository, hintActionFactory);

  const mockPushKey = vi.spyOn(hintRepository, "pushKey").mockResolvedValue();
  const mockPopKey = vi.spyOn(hintRepository, "popKey").mockResolvedValue();
  const mockShowHints = vi.spyOn(hintClient, "showHints").mockResolvedValue();
  const mockActivate = vi.spyOn(mockAction, "activate").mockResolvedValue();

  beforeEach(() => {
    mockPushKey.mockClear();
    mockPopKey.mockClear();
    mockShowHints.mockClear();
    mockActivate.mockClear();
  });

  it("filters pressed key", async () => {
    vi.spyOn(hintRepository, "getTargetFrameIds").mockResolvedValue([0, 1]);
    vi.spyOn(hintRepository, "getAllMatchedHints").mockResolvedValue([
      { frameId: 0, element: "0", tag: "a" },
      { frameId: 0, element: "1", tag: "aa" },
      { frameId: 1, element: "0", tag: "ab" },
    ]);
    vi.spyOn(hintRepository, "getMatchedHints").mockImplementation(
      (frameId) => {
        switch (frameId) {
          case 0:
            return Promise.resolve([
              { frameId: 0, element: "0", tag: "a" },
              { frameId: 0, element: "1", tag: "aa" },
            ]);
          case 1:
            return Promise.resolve([{ frameId: 1, element: "0", tag: "ab" }]);
          default:
            return Promise.resolve([]);
        }
      },
    );
    vi.spyOn(hintActionFactory, "createHintAction").mockReturnValue(mockAction);
    const cont = await sut.pressKey(10, "a");

    expect(cont).toBeTruthy();
    expect(mockPushKey).toHaveBeenCalledWith("a");
    expect(mockShowHints).toHaveBeenCalledWith(10, 0, ["0", "1"]);
    expect(mockShowHints).toHaveBeenCalledWith(10, 1, ["0"]);
    expect(mockActivate).not.toHaveBeenCalled();
  });

  it("activate if exactly matched", async () => {
    vi.spyOn(hintRepository, "getOption").mockResolvedValue({
      newTab: true,
      background: false,
    });

    vi.spyOn(hintRepository, "getAllMatchedHints").mockResolvedValue([
      { frameId: 0, element: "0", tag: "a" },
    ]);
    vi.spyOn(hintRepository, "getHintModeName").mockResolvedValue("hint.test");
    vi.spyOn(hintActionFactory, "createHintAction").mockReturnValue(mockAction);
    const cont = await sut.pressKey(10, "a");

    expect(cont).toBeFalsy();
    expect(mockPushKey).toHaveBeenCalledWith("a");
    expect(mockActivate).toHaveBeenCalled();
  });

  it("activate when enter pressed", async () => {
    vi.spyOn(hintRepository, "getOption").mockResolvedValue({
      newTab: true,
      background: false,
    });
    vi.spyOn(hintActionFactory, "createHintAction").mockReturnValue(mockAction);

    vi.spyOn(hintRepository, "getAllMatchedHints").mockResolvedValue([
      { frameId: 0, element: "0", tag: "ab" },
      { frameId: 0, element: "1", tag: "aba" },
      { frameId: 0, element: "2", tag: "abb" },
    ]);
    vi.spyOn(hintRepository, "getHintModeName").mockResolvedValue("hint.test");
    vi.spyOn(hintActionFactory, "createHintAction").mockReturnValue(mockAction);
    const cont = await sut.pressKey(10, "Enter");

    expect(cont).toBeFalsy();
    expect(mockActivate).toHaveBeenCalled();
  });

  it("delete a chatacter when backspace pressed", async () => {
    vi.spyOn(hintRepository, "getTargetFrameIds").mockResolvedValue([0, 1]);
    vi.spyOn(hintRepository, "getAllMatchedHints").mockResolvedValue([
      { frameId: 0, element: "0", tag: "a" },
      { frameId: 0, element: "1", tag: "aa" },
      { frameId: 1, element: "0", tag: "ab" },
    ]);
    vi.spyOn(hintRepository, "getMatchedHints").mockImplementation(
      (frameId) => {
        switch (frameId) {
          case 0:
            return Promise.resolve([
              { frameId: 0, element: "0", tag: "a" },
              { frameId: 0, element: "1", tag: "aa" },
            ]);
          case 1:
            return Promise.resolve([{ frameId: 1, element: "0", tag: "ab" }]);
          default:
            return Promise.resolve([]);
        }
      },
    );
    const cont = await sut.pressKey(10, "Backspace");

    expect(cont).toBeTruthy();
    expect(mockPopKey).toHaveBeenCalled();
    expect(mockShowHints).toHaveBeenCalledWith(10, 0, ["0", "1"]);
    expect(mockShowHints).toHaveBeenCalledWith(10, 1, ["0"]);
  });
});
