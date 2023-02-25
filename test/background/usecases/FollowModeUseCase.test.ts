import FollowModeUseCaes from "../../../src/background/usecases/FollowModeUseCase";
import MockFollowClient from "../mock/MockFollowClient";
import MockTopFrameClient from "../mock/MockTopFrameClient";
import MockReadyFrameRepository from "../mock/MockReadyFrameRepository";
import MockPropertySettings from "../mock/MockPropertySettings";
import MockKeyCaptureClient from "../mock/MockKeyCaptureClient";
import MockFollowRepository from "../mock/MockFollowRepository";

describe("FollowModeUseCaes", () => {
  it("starts follow mode", async () => {
    const topFrameClient = new MockTopFrameClient();
    const followClient = new MockFollowClient();
    const frameRepository = new MockReadyFrameRepository();
    const propertySettings = new MockPropertySettings();
    const keyCaptureClient = new MockKeyCaptureClient();
    const followRepository = new MockFollowRepository();
    const sut = new FollowModeUseCaes(
      topFrameClient,
      followClient,
      frameRepository,
      propertySettings,
      keyCaptureClient,
      followRepository
    );

    const tab = {
      id: 10,
      url: "https://example.com/",
    } as browser.tabs.Tab;

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
      .spyOn(followClient, "countHints")
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
      .spyOn(followClient, "createHints")
      .mockResolvedValue();
    const mockStartFollowMode = jest
      .spyOn(followRepository, "startFollowMode")
      .mockResolvedValue(undefined);
    const mockEnableKeyCapture = jest
      .spyOn(keyCaptureClient, "enableKeyCapture")
      .mockResolvedValue(undefined);

    await sut.start({ sender: { tab } }, false, false);

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
      { x: 10, y: 20 }
    );
    expect(mockCountHints).toHaveBeenCalledWith(
      10,
      101,
      { width: 1000, height: 1200 },
      { x: 11, y: 21 }
    );
    expect(mockCountHints).toHaveBeenCalledWith(
      10,
      102,
      { width: 1000, height: 1200 },
      { x: 12, y: 22 }
    );
    expect(mockCreateHints).toHaveBeenCalledWith(
      10,
      100,
      ["a"],
      { width: 1000, height: 1200 },
      { x: 10, y: 20 }
    );
    expect(mockCreateHints).toHaveBeenCalledWith(
      10,
      101,
      ["b", "c"],
      { width: 1000, height: 1200 },
      { x: 11, y: 21 }
    );
    expect(mockCreateHints).toHaveBeenCalledWith(
      10,
      102,
      ["aa", "ab", "ac"],
      { width: 1000, height: 1200 },
      { x: 12, y: 22 }
    );
    expect(mockStartFollowMode).toHaveBeenCalledWith(
      { newTab: false, background: false },
      ["a", "b", "c", "aa", "ab", "ac"]
    );
    expect(mockEnableKeyCapture).toHaveBeenCalledWith(10);
  });

  it("stops follow mode", async () => {
    const topFrameClient = new MockTopFrameClient();
    const followClient = new MockFollowClient();
    const frameRepository = new MockReadyFrameRepository();
    const propertySettings = new MockPropertySettings();
    const keyCaptureClient = new MockKeyCaptureClient();
    const followRepository = new MockFollowRepository();
    const sut = new FollowModeUseCaes(
      topFrameClient,
      followClient,
      frameRepository,
      propertySettings,
      keyCaptureClient,
      followRepository
    );

    const tab = {
      id: 10,
      url: "https://example.com/",
    } as browser.tabs.Tab;

    const mockClearHints = jest
      .spyOn(followClient, "clearHints")
      .mockResolvedValue();
    const mockStopFollowMode = jest
      .spyOn(followRepository, "stopFollowMode")
      .mockResolvedValue();
    const mockDisableKeyCapture = jest
      .spyOn(keyCaptureClient, "disableKeyCapture")
      .mockResolvedValue();

    await sut.stop({ sender: { tab } });

    expect(mockClearHints).toHaveBeenCalledWith(10);
    expect(mockStopFollowMode).toHaveBeenCalled();
    expect(mockDisableKeyCapture).toHaveBeenCalledWith(10);
  });
});
