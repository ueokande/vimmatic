import HintModeUseCaes from "../../../src/background/usecases/HintModeUseCase";
import MockHintClient from "../mock/MockHintClient";
import MockTopFrameClient from "../mock/MockTopFrameClient";
import MockReadyFrameRepository from "../mock/MockReadyFrameRepository";
import MockPropertySettings from "../mock/MockPropertySettings";
import MockHintRepository from "../mock/MockHintRepository";
import MockHintActionFactory from "../mock/MockHintActionFactory";

describe("HintModeUseCaes", () => {
  const topFrameClient = new MockTopFrameClient();
  const hintClient = new MockHintClient();
  const frameRepository = new MockReadyFrameRepository();
  const propertySettings = new MockPropertySettings();
  const hintRepository = new MockHintRepository();
  const hintActionFactory = new MockHintActionFactory();
  const sut = new HintModeUseCaes(
    topFrameClient,
    hintClient,
    frameRepository,
    propertySettings,
    hintRepository,
    hintActionFactory,
  );

  it("starts follow mode", async () => {
    const mockGetFrameIds = jest
      .spyOn(frameRepository, "getFrameIds")
      .mockResolvedValue([100, 101, 102]);
    const mockGetProperty = jest
      .spyOn(propertySettings, "getProperty")
      .mockResolvedValue("abc");
    const mockGetWindowViewport = jest
      .spyOn(topFrameClient, "getWindowViewport")
      .mockResolvedValue({ width: 1000, height: 1200 });
    const mockGetFramePosition = jest
      .spyOn(topFrameClient, "getFramePosition")
      .mockImplementation((_tabId: number, frameId: number) => {
        switch (frameId) {
          case 100:
            return Promise.resolve({ x: 10, y: 20 });
          case 101:
            return Promise.resolve({ x: 11, y: 21 });
          case 102:
            return Promise.resolve({ x: 12, y: 22 });
        }
        return Promise.resolve(undefined);
      });
    const mockLookupTargets = jest
      .spyOn(hintClient, "lookupTargets")
      .mockImplementation((_tabId, frameId: number) => {
        switch (frameId) {
          case 100:
            return Promise.resolve(["0"]);
          case 101:
            return Promise.resolve(["0", "1"]);
          case 102:
            return Promise.resolve(["0", "1", "2"]);
        }
        return Promise.resolve([]);
      });
    const mockAssignTags = jest
      .spyOn(hintClient, "assignTags")
      .mockResolvedValue();
    const mockStartHintMode = jest
      .spyOn(hintRepository, "startHintMode")
      .mockResolvedValue(undefined);

    await sut.start(10, "hint.test", false, false);

    expect(mockGetFrameIds).toHaveBeenCalledWith(10);
    expect(mockGetProperty).toHaveBeenCalledWith("hintchars");
    expect(mockGetWindowViewport).toHaveBeenCalledWith(10);
    expect(mockGetFramePosition).toHaveBeenCalledWith(10, 100);
    expect(mockGetFramePosition).toHaveBeenCalledWith(10, 101);
    expect(mockGetFramePosition).toHaveBeenCalledWith(10, 102);
    expect(mockLookupTargets).toHaveBeenCalledWith(
      10,
      100,
      "[mock]",
      { width: 1000, height: 1200 },
      { x: 10, y: 20 },
    );
    expect(mockLookupTargets).toHaveBeenCalledWith(
      10,
      101,
      "[mock]",
      { width: 1000, height: 1200 },
      { x: 11, y: 21 },
    );
    expect(mockLookupTargets).toHaveBeenCalledWith(
      10,
      102,
      "[mock]",
      { width: 1000, height: 1200 },
      { x: 12, y: 22 },
    );
    expect(mockAssignTags).toHaveBeenCalledWith(10, 100, { "0": "a" });
    expect(mockAssignTags).toHaveBeenCalledWith(10, 101, {
      "0": "b",
      "1": "c",
    });
    expect(mockAssignTags).toHaveBeenCalledWith(10, 102, {
      "0": "aa",
      "1": "ab",
      "2": "ac",
    });
    expect(mockStartHintMode).toHaveBeenCalledWith(
      "hint.test",
      { newTab: false, background: false },
      [
        { frameId: 100, element: "0", tag: "a" },
        { frameId: 101, element: "0", tag: "b" },
        { frameId: 101, element: "1", tag: "c" },
        { frameId: 102, element: "0", tag: "aa" },
        { frameId: 102, element: "1", tag: "ab" },
        { frameId: 102, element: "2", tag: "ac" },
      ],
    );
  });

  it("stops follow mode", async () => {
    const mockClearHints = jest
      .spyOn(hintClient, "clearHints")
      .mockResolvedValue();
    jest.spyOn(hintRepository, "stopHintMode").mockResolvedValue();

    await sut.stop(10);

    expect(mockClearHints).toHaveBeenCalledWith(10);
  });
});
