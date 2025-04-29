import { HintKeyUseCase } from "../../../src/background/usecases/HintKeyUseCase";
import { MockHintClient } from "../mock/MockHintClient";
import { MockHintRepository } from "../mock/MockHintRepository";
import { MockHintActionFactory } from "../mock/MockHintActionFactory";
import type { HintAction } from "../../../src/background/hint/types";
import { describe, it, vi, expect } from "vitest";
import { MockConsoleClient } from "../mock/MockConsoleClient";

class MockHintAction implements HintAction {
  description(): string {
    return "mock";
  }

  lookupTargetSelector(): string {
    return "[mock]";
  }

  activate(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

describe("HintKeyUseCase", () => {
  const hintClient = new MockHintClient();
  const hintRepository = new MockHintRepository();
  const hintActionFactory = new MockHintActionFactory();
  const mockAction = new MockHintAction();
  const consoleClient = new MockConsoleClient();
  const sut = new HintKeyUseCase(
    hintClient,
    hintRepository,
    hintActionFactory,
    consoleClient,
  );

  const mockPushKey = vi.spyOn(hintRepository, "pushKey").mockResolvedValue();
  const mockPopKey = vi.spyOn(hintRepository, "popKey").mockResolvedValue();
  const mockShowHints = vi.spyOn(hintClient, "showHints").mockResolvedValue();
  const mockActivate = vi.spyOn(mockAction, "activate").mockResolvedValue();
  vi.spyOn(hintRepository, "getCurrentQueuedKeys").mockResolvedValue("");
  vi.spyOn(consoleClient, "showInfo").mockResolvedValue();
  vi.spyOn(consoleClient, "hide").mockResolvedValue();

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
    vi.spyOn(hintRepository, "getHintModeName").mockResolvedValue("hint.test");
    vi.spyOn(hintActionFactory, "createHintAction").mockReturnValue(mockAction);
    const r = await sut.pressKey(10, "a");

    expect(r).toBe("continue_key_input");
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
    const r = await sut.pressKey(10, "a");

    expect(r).toBe("activate");
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
    const r = await sut.pressKey(10, "Enter");

    expect(r).toBe("activate");
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
    const r = await sut.pressKey(10, "Backspace");

    expect(r).toBe("continue_key_input");
    expect(mockPopKey).toHaveBeenCalled();
    expect(mockShowHints).toHaveBeenCalledWith(10, 0, ["0", "1"]);
    expect(mockShowHints).toHaveBeenCalledWith(10, 1, ["0"]);
  });
});
