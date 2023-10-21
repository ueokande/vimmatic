import MockFindClient from "../mock/MockFindClient";
import MockFindHistoryRepository from "../mock/MockFindHistoryRepository";
import MockFindRepository from "../mock/MockFindRepository";
import MockConsoleClient from "../mock/MockConsoleClient";
import MockReadyFrameRepository from "../mock/MockReadyFrameRepository";
import FindUseCase from "../../../src/background/usecases/FindUseCase";

describe("FindUseCase", () => {
  const tabId = 100;
  const frameIds = [0, 100, 101];
  const keyword = "hello";

  const findClient = new MockFindClient();
  const findRepository = new MockFindRepository();
  const findHistoryRepository = new MockFindHistoryRepository();
  const consoleClient = new MockConsoleClient();
  const frameRepository = new MockReadyFrameRepository();
  const sut = new FindUseCase(
    findClient,
    findRepository,
    findHistoryRepository,
    consoleClient,
    frameRepository,
  );
  const getFrameIdsSpy = jest
    .spyOn(frameRepository, "getFrameIds")
    .mockResolvedValue(frameIds);
  const clearSelectionSpy = jest
    .spyOn(findClient, "clearSelection")
    .mockResolvedValue();
  const findNextSpy = jest.spyOn(findClient, "findNext");
  const setLocalStateSpy = jest
    .spyOn(findRepository, "setLocalState")
    .mockResolvedValue();
  const setGlobalKeywordSpy = jest.spyOn(findRepository, "setGlobalKeyword");
  const appendHistorySpy = jest
    .spyOn(findHistoryRepository, "append")
    .mockResolvedValue();

  beforeEach(async () => {
    getFrameIdsSpy.mockClear();
    clearSelectionSpy.mockClear();
    findNextSpy.mockClear();
    setLocalStateSpy.mockClear();
    setGlobalKeywordSpy.mockClear();
    appendHistorySpy.mockClear();
  });

  describe("startFind", () => {
    it("starts a find with a keyword", async () => {
      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const showInfoSpy = jest
        .spyOn(consoleClient, "showInfo")
        .mockResolvedValue(undefined);

      await sut.startFind(tabId, keyword);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toBeCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(0);
      expect(findNextSpy.mock.calls[1][1]).toEqual(100);
      expect(setLocalStateSpy).toBeCalledWith(tabId, {
        keyword,
        frameId: 100,
      });
      expect(setGlobalKeywordSpy).toBeCalledWith(keyword);
      expect(appendHistorySpy).toBeCalledWith(keyword);
      expect(showInfoSpy).toBeCalledWith(tabId, "Pattern found: " + keyword);
    });

    it("starts a find with last local state", async () => {
      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const getLocalStateSpy = jest
        .spyOn(findRepository, "getLocalState")
        .mockResolvedValue({ keyword, frameId: 0 });
      const showInfoSpy = jest
        .spyOn(consoleClient, "showInfo")
        .mockResolvedValue(undefined);

      await sut.startFind(tabId, undefined);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toBeCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(0);
      expect(findNextSpy.mock.calls[1][1]).toEqual(100);
      expect(getLocalStateSpy).toBeCalledWith(tabId);
      expect(setLocalStateSpy).toBeCalledWith(tabId, {
        keyword,
        frameId: 100,
      });
      expect(setGlobalKeywordSpy).toBeCalledWith(keyword);
      expect(appendHistorySpy).toBeCalledWith(keyword);
      expect(showInfoSpy).toBeCalledWith(tabId, "Pattern found: " + keyword);
    });

    it("starts a find with last global state", async () => {
      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const getLocalStateSpy = jest
        .spyOn(findRepository, "getLocalState")
        .mockResolvedValue(undefined);
      jest.spyOn(findRepository, "getGlobalKeyword").mockResolvedValue(keyword);
      const showInfoSpy = jest
        .spyOn(consoleClient, "showInfo")
        .mockResolvedValue(undefined);

      await sut.startFind(tabId, undefined);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toBeCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(0);
      expect(findNextSpy.mock.calls[1][1]).toEqual(100);
      expect(getLocalStateSpy).toBeCalledWith(tabId);
      expect(setLocalStateSpy).toBeCalledWith(tabId, {
        keyword,
        frameId: 100,
      });
      expect(setGlobalKeywordSpy).toBeCalledWith(keyword);
      expect(appendHistorySpy).toBeCalledWith(keyword);
      expect(showInfoSpy).toBeCalledWith(tabId, "Pattern found: " + keyword);
    });

    it("shows an error when pattern not found", async () => {
      findNextSpy.mockResolvedValue(false);
      const showErrorSpy = jest
        .spyOn(consoleClient, "showError")
        .mockResolvedValue(undefined);

      await sut.startFind(tabId, keyword);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(setLocalStateSpy).not.toBeCalled();
      expect(setGlobalKeywordSpy).toBeCalledWith(keyword);
      expect(appendHistorySpy).toBeCalledWith(keyword);
      expect(showErrorSpy).toBeCalledWith(
        tabId,
        "Pattern not found: " + keyword,
      );
    });

    it("shows an error when no last keywords", async () => {
      jest.spyOn(findRepository, "getLocalState").mockResolvedValue(undefined);
      jest
        .spyOn(findRepository, "getGlobalKeyword")
        .mockResolvedValue(undefined);

      const showErrorSpy = jest
        .spyOn(consoleClient, "showError")
        .mockResolvedValue(undefined);

      await sut.startFind(tabId, undefined);

      expect(showErrorSpy).toBeCalledWith(tabId, "No previous search keywords");
    });
  });
});
