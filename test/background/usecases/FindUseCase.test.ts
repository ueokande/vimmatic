import { MockFindClient } from "../mock/MockFindClient";
import { MockFindHistoryRepository } from "../mock/MockFindHistoryRepository";
import { MockFindRepository } from "../mock/MockFindRepository";
import { MockConsoleClient } from "../mock/MockConsoleClient";
import { MockReadyFrameRepository } from "../mock/MockReadyFrameRepository";
import { MockPropertySettings } from "../mock/MockPropertySettings";
import { FindUseCase } from "../../../src/background/usecases/FindUseCase";
import { describe, it, vi, expect } from "vitest";

describe("FindUseCase", () => {
  const tabId = 100;
  const frameIds = [0, 100, 101];
  const keyword = "hello";

  const findClient = new MockFindClient();
  const findRepository = new MockFindRepository();
  const findHistoryRepository = new MockFindHistoryRepository();
  const consoleClient = new MockConsoleClient();
  const frameRepository = new MockReadyFrameRepository();
  const propertySettings = new MockPropertySettings();
  const sut = new FindUseCase(
    findClient,
    findRepository,
    findHistoryRepository,
    consoleClient,
    frameRepository,
    propertySettings,
  );
  const clearSelectionSpy = vi
    .spyOn(findClient, "clearSelection")
    .mockResolvedValue();
  const findNextSpy = vi.spyOn(findClient, "findNext");
  const findPrevSpy = vi.spyOn(findClient, "findPrev");
  const setLocalStateSpy = vi
    .spyOn(findRepository, "setLocalState")
    .mockResolvedValue();
  const setGlobalKeywordSpy = vi.spyOn(findRepository, "setGlobalKeyword");
  const appendHistorySpy = vi
    .spyOn(findHistoryRepository, "append")
    .mockResolvedValue();
  vi.spyOn(frameRepository, "getFrameIds").mockResolvedValue(frameIds);
  vi.spyOn(propertySettings, "getProperty").mockImplementation(
    (key: string) => {
      switch (key) {
        case "ignorecase":
          return Promise.resolve(false);
        case "findmode":
          return Promise.resolve("normal");
      }
      throw new Error("Unexpected key: " + key);
    },
  );

  describe("startFind", () => {
    it("starts a find with a keyword", async () => {
      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const showInfoSpy = vi
        .spyOn(consoleClient, "showInfo")
        .mockResolvedValue(undefined);

      await sut.startFind(tabId, keyword);

      expect(clearSelectionSpy).toHaveBeenCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toHaveBeenCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(0);
      expect(findNextSpy.mock.calls[1][1]).toEqual(100);
      expect(setLocalStateSpy).toHaveBeenCalledWith(tabId, {
        keyword,
        frameId: 100,
      });
      expect(setGlobalKeywordSpy).toHaveBeenCalledWith(keyword);
      expect(appendHistorySpy).toHaveBeenCalledWith(keyword);
      expect(showInfoSpy).toHaveBeenCalledWith(
        tabId,
        "Pattern found: " + keyword,
      );
    });

    it.each([undefined, ""])(
      "starts a find from local state with a empty keyword (%p)",
      async (givenKeyword) => {
        findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
        const getLocalStateSpy = vi
          .spyOn(findRepository, "getLocalState")
          .mockResolvedValueOnce({ keyword, frameId: 0 });
        const showInfoSpy = vi
          .spyOn(consoleClient, "showInfo")
          .mockResolvedValue(undefined);

        await sut.startFind(tabId, givenKeyword);

        expect(clearSelectionSpy).toHaveBeenCalledTimes(3);
        expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
        expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
        expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
        expect(findNextSpy).toHaveBeenCalledTimes(2);
        expect(findNextSpy.mock.calls[0][1]).toEqual(0);
        expect(findNextSpy.mock.calls[1][1]).toEqual(100);
        expect(getLocalStateSpy).toHaveBeenCalledWith(tabId);
        expect(setLocalStateSpy).toHaveBeenCalledWith(tabId, {
          keyword,
          frameId: 100,
        });
        expect(setGlobalKeywordSpy).toHaveBeenCalledWith(keyword);
        expect(appendHistorySpy).toHaveBeenCalledWith(keyword);
        expect(showInfoSpy).toHaveBeenCalledWith(
          tabId,
          "Pattern found: " + keyword,
        );
      },
    );

    it.each([undefined, ""])(
      "starts a find from the global keyword with a empty keyword (%p)",
      async (givenKeyword) => {
        findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
        const getLocalStateSpy = vi
          .spyOn(findRepository, "getLocalState")
          .mockResolvedValue(undefined);
        vi.spyOn(findRepository, "getGlobalKeyword").mockResolvedValue(keyword);
        const showInfoSpy = vi
          .spyOn(consoleClient, "showInfo")
          .mockResolvedValue(undefined);

        await sut.startFind(tabId, givenKeyword);

        expect(clearSelectionSpy).toHaveBeenCalledTimes(3);
        expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
        expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
        expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
        expect(findNextSpy).toHaveBeenCalledTimes(2);
        expect(findNextSpy.mock.calls[0][1]).toEqual(0);
        expect(findNextSpy.mock.calls[1][1]).toEqual(100);
        expect(getLocalStateSpy).toHaveBeenCalledWith(tabId);
        expect(setLocalStateSpy).toHaveBeenCalledWith(tabId, {
          keyword,
          frameId: 100,
        });
        expect(setGlobalKeywordSpy).toHaveBeenCalledWith(keyword);
        expect(appendHistorySpy).toHaveBeenCalledWith(keyword);
        expect(showInfoSpy).toHaveBeenCalledWith(
          tabId,
          "Pattern found: " + keyword,
        );
      },
    );

    it("shows an error when pattern not found", async () => {
      findNextSpy.mockResolvedValue(false);
      const showErrorSpy = vi
        .spyOn(consoleClient, "showError")
        .mockResolvedValue(undefined);

      await sut.startFind(tabId, keyword);

      expect(clearSelectionSpy).toHaveBeenCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(setLocalStateSpy).not.toHaveBeenCalled();
      expect(setGlobalKeywordSpy).toHaveBeenCalledWith(keyword);
      expect(appendHistorySpy).toHaveBeenCalledWith(keyword);
      expect(showErrorSpy).toHaveBeenCalledWith(
        tabId,
        "Pattern not found: " + keyword,
      );
    });

    it("shows an error when no last keywords", async () => {
      vi.spyOn(findRepository, "getLocalState").mockResolvedValue(undefined);
      vi.spyOn(findRepository, "getGlobalKeyword").mockResolvedValue(undefined);

      const showErrorSpy = vi
        .spyOn(consoleClient, "showError")
        .mockResolvedValue(undefined);

      await sut.startFind(tabId, undefined);

      expect(showErrorSpy).toHaveBeenCalledWith(
        tabId,
        "No previous search keywords",
      );
    });
  });

  describe("findNext", () => {
    it("shows errors if no previous keywords", async () => {
      vi.spyOn(findRepository, "getLocalState").mockResolvedValue(undefined);
      const showErrorSpy = vi
        .spyOn(consoleClient, "showError")
        .mockResolvedValue(undefined);

      await sut.findNext(tabId);

      expect(showErrorSpy).toHaveBeenCalledWith(
        100,
        "No previous search keywords",
      );
    });

    it("continues a search on the same frame", async () => {
      vi.spyOn(findRepository, "getLocalState").mockResolvedValue({
        keyword,
        frameId: 100,
      });
      findNextSpy.mockResolvedValue(true);
      const setLocalStateSpy = vi.spyOn(findRepository, "setLocalState");

      await sut.findNext(tabId);

      expect(findNextSpy).toHaveBeenCalledWith(100, 100, {
        keyword,
        mode: "normal",
        ignoreCase: false,
      });
      expect(setLocalStateSpy).toHaveBeenCalledWith(100, {
        keyword,
        frameId: 100,
      });
    });

    it("continues a search on next frame", async () => {
      vi.spyOn(findRepository, "getLocalState").mockResolvedValue({
        keyword,
        frameId: 100,
      });

      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const setLocalStateSpy = vi.spyOn(findRepository, "setLocalState");

      await sut.findNext(tabId);

      expect(findNextSpy).toHaveBeenCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(100);
      expect(findNextSpy.mock.calls[1][1]).toEqual(101);
      expect(clearSelectionSpy).toHaveBeenCalledWith(100, 100);
      expect(setLocalStateSpy).toHaveBeenCalledWith(100, {
        keyword,
        frameId: 101,
      });
    });

    it("exercise a wrap-search", async () => {
      vi.spyOn(findRepository, "getLocalState").mockResolvedValue({
        keyword,
        frameId: 101,
      });

      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const setLocalStateSpy = vi.spyOn(findRepository, "setLocalState");

      await sut.findNext(tabId);

      expect(findNextSpy).toHaveBeenCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(101);
      expect(findNextSpy.mock.calls[1][1]).toEqual(0);
      expect(clearSelectionSpy).toHaveBeenCalledWith(100, 101);
      expect(setLocalStateSpy).toHaveBeenCalledWith(100, {
        keyword,
        frameId: 0,
      });
    });

    it("starts a search with last keywords", async () => {
      vi.spyOn(findRepository, "getLocalState").mockResolvedValue(undefined);
      vi.spyOn(findRepository, "getGlobalKeyword").mockResolvedValue(keyword);
      vi.spyOn(consoleClient, "showInfo").mockResolvedValue(undefined);

      const setLocalStateSpy = vi.spyOn(findRepository, "setLocalState");

      await sut.findNext(tabId);

      expect(clearSelectionSpy).toHaveBeenCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toHaveBeenCalledWith(100, 0, {
        keyword,
        mode: "normal",
        ignoreCase: false,
      });
      expect(setLocalStateSpy).toHaveBeenCalledWith(100, {
        keyword,
        frameId: 0,
      });
    });
  });

  describe("findPrev", () => {
    it("shows errors if no previous keywords", async () => {
      vi.spyOn(findRepository, "getLocalState").mockResolvedValue(undefined);
      vi.spyOn(findRepository, "getGlobalKeyword").mockResolvedValue(undefined);
      const showErrorSpy = vi
        .spyOn(consoleClient, "showError")
        .mockResolvedValue(undefined);

      await sut.findPrev(tabId);

      expect(showErrorSpy).toHaveBeenCalledWith(
        100,
        "No previous search keywords",
      );
    });

    it("continues a search on the same frame", async () => {
      vi.spyOn(findRepository, "getLocalState").mockResolvedValue({
        keyword,
        frameId: 100,
      });
      findPrevSpy.mockResolvedValue(true);
      const setLocalStateSpy = vi.spyOn(findRepository, "setLocalState");

      await sut.findPrev(tabId);

      expect(findPrevSpy).toHaveBeenCalledWith(100, 100, {
        keyword,
        mode: "normal",
        ignoreCase: false,
      });
      expect(setLocalStateSpy).toHaveBeenCalledWith(100, {
        keyword,
        frameId: 100,
      });
    });

    it("continues a search on next frame", async () => {
      vi.spyOn(findRepository, "getLocalState").mockResolvedValue({
        keyword,
        frameId: 100,
      });
      findPrevSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const setLocalStateSpy = vi.spyOn(findRepository, "setLocalState");

      await sut.findPrev(tabId);

      expect(findPrevSpy).toHaveBeenCalledTimes(2);
      expect(findPrevSpy.mock.calls[0][1]).toEqual(100);
      expect(findPrevSpy.mock.calls[1][1]).toEqual(0);
      expect(clearSelectionSpy).toHaveBeenCalledWith(100, 100);
      expect(setLocalStateSpy).toHaveBeenCalledWith(100, {
        keyword,
        frameId: 0,
      });
    });

    it("exercise a wrap-search", async () => {
      vi.spyOn(findRepository, "getLocalState").mockResolvedValue({
        keyword,
        frameId: 0,
      });

      findPrevSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const setLocalStateSpy = vi.spyOn(findRepository, "setLocalState");

      await sut.findPrev(tabId);

      expect(findPrevSpy).toHaveBeenCalledTimes(2);
      expect(findPrevSpy.mock.calls[0][1]).toEqual(0);
      expect(findPrevSpy.mock.calls[1][1]).toEqual(101);
      expect(clearSelectionSpy).toHaveBeenCalledWith(100, 0);
      expect(setLocalStateSpy).toHaveBeenCalledWith(100, {
        keyword,
        frameId: 101,
      });
    });

    it("starts a search with last keywords", async () => {
      vi.spyOn(findRepository, "getLocalState").mockResolvedValue(undefined);
      vi.spyOn(findRepository, "getGlobalKeyword").mockResolvedValue(keyword);
      vi.spyOn(consoleClient, "showInfo").mockResolvedValue(undefined);

      const setLocalStateSpy = vi.spyOn(findRepository, "setLocalState");

      await sut.findPrev(tabId);

      expect(clearSelectionSpy).toHaveBeenCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(101);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(0);
      expect(findPrevSpy).toHaveBeenCalledWith(100, 101, {
        keyword,
        mode: "normal",
        ignoreCase: false,
      });
      expect(setLocalStateSpy).toHaveBeenCalledWith(100, {
        keyword,
        frameId: 101,
      });
    });
  });
});
