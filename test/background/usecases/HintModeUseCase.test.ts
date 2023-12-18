import HintModeUseCaes from "../../../src/background/usecases/HintModeUseCase";
import MockHintClient from "../mock/MockHintClient";
import MockTopFrameClient from "../mock/MockTopFrameClient";
import MockReadyFrameRepository from "../mock/MockReadyFrameRepository";
import MockPropertySettings from "../mock/MockPropertySettings";
import MockHintRepository from "../mock/MockHintRepository";

describe("HintModeUseCaes", () => {
  it("starts follow mode", async () => {
    const topFrameClient = new MockTopFrameClient();
    const hintClient = new MockHintClient();
    const frameRepository = new MockReadyFrameRepository();
    const propertySettings = new MockPropertySettings();
    const hintRepository = new MockHintRepository();
    const sut = new HintModeUseCaes(
      topFrameClient,
      hintClient,
      frameRepository,
      propertySettings,
      hintRepository,
    );

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
      .mockImplementation((_tabId, frameId: number) => {
        switch (frameId) {
          case 100:
            return Promise.resolve({ x: 10, y: 20 });
          case 101:
            return Promise.resolve({ x: 11, y: 21 });
          case 102:
            return Promise.resolve({ x: 12, y: 22 });
        }
      });
    const mockCountHints = jest
      .spyOn(hintClient, "countHints")
      .mockImplementation((_tabId, frameId: number) => {
        switch (frameId) {
          case 100:
            return Promise.resolve(1);
          case 101:
            return Promise.resolve(2);
          case 102:
            return Promise.resolve(3);
        }
      });
    const mockCreateHints = jest
      .spyOn(hintClient, "createHints")
      .mockResolvedValue();
    const mockStartHintMode = jest
      .spyOn(hintRepository, "startHintMode")
      .mockResolvedValue(undefined);

    await sut.start(10, false, false);

    expect(mockGetFrameIds).toHaveBeenCalledWith(10);
    expect(mockGetProperty).toHaveBeenCalledWith("hintchars");
    expect(mockGetWindowViewport).toHaveBeenCalledWith(10);
    expect(mockGetFramePosition).toHaveBeenCalledWith(10, 100);
    expect(mockGetFramePosition).toHaveBeenCalledWith(10, 101);
    expect(mockGetFramePosition).toHaveBeenCalledWith(10, 102);
    expect(mockCountHints).toHaveBeenCalledWith(
      10,
      100,
      { width: 1000, height: 1200 },
      { x: 10, y: 20 },
    );
    expect(mockCountHints).toHaveBeenCalledWith(
      10,
      101,
      { width: 1000, height: 1200 },
      { x: 11, y: 21 },
    );
    expect(mockCountHints).toHaveBeenCalledWith(
      10,
      102,
      { width: 1000, height: 1200 },
      { x: 12, y: 22 },
    );
    expect(mockCreateHints).toHaveBeenCalledWith(
      10,
      100,
      ["a"],
      { width: 1000, height: 1200 },
      { x: 10, y: 20 },
    );
    expect(mockCreateHints).toHaveBeenCalledWith(
      10,
      101,
      ["b", "c"],
      { width: 1000, height: 1200 },
      { x: 11, y: 21 },
    );
    expect(mockCreateHints).toHaveBeenCalledWith(
      10,
      102,
      ["aa", "ab", "ac"],
      { width: 1000, height: 1200 },
      { x: 12, y: 22 },
    );
    expect(mockStartHintMode).toHaveBeenCalledWith(
      { newTab: false, background: false },
      ["a", "b", "c", "aa", "ab", "ac"],
    );
  });

  it("stops follow mode", async () => {
    const topFrameClient = new MockTopFrameClient();
    const hintClient = new MockHintClient();
    const frameRepository = new MockReadyFrameRepository();
    const propertySettings = new MockPropertySettings();
    const hintRepository = new MockHintRepository();
    const sut = new HintModeUseCaes(
      topFrameClient,
      hintClient,
      frameRepository,
      propertySettings,
      hintRepository,
    );

    const mockClearHints = jest
      .spyOn(hintClient, "clearHints")
      .mockResolvedValue();
    jest.spyOn(hintRepository, "stopHintMode").mockResolvedValue();

    await sut.stop(10);

    expect(mockClearHints).toHaveBeenCalledWith(10);
  });
});
