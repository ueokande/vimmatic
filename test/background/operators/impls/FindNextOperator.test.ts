import FindNextOperator from "../../../../src/background/operators/impls/FindNextOperator";
import MockFindRepository from "../../mock/MockFindRepository";
import MockFindClient from "../../mock/MockFindClient";
import MockConsoleClient from "../../mock/MockConsoleClient";
import MockReadyFrameRepository from "../../mock/MockReadyFrameRepository";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("FindNextOperator", () => {
  const keyword = "hello";
  const frameIds = [0, 100, 101];

  const findRepository = new MockFindRepository();
  const findClient = new MockFindClient();
  const consoleClient = new MockConsoleClient();
  const frameRepository = new MockReadyFrameRepository();
  const sut = new FindNextOperator(
    findRepository,
    findClient,
    consoleClient,
    frameRepository
  );
  const ctx = { sender: { tabId: 10 } } as OperatorContext;
  const findNextSpy = jest.spyOn(findClient, "findNext");
  const clearSelectionSpy = jest.spyOn(findClient, "clearSelection");

  beforeEach(async () => {
    findNextSpy.mockClear();
    clearSelectionSpy.mockClear().mockReturnValue(Promise.resolve());
    jest.spyOn(frameRepository, "getFrameIds").mockReturnValue(frameIds);
  });

  describe("#run", () => {
    it("shows errors if no previous keywords", async () => {
      jest.spyOn(findRepository, "getLocalState").mockReturnValue(undefined);
      const showErrorSpy = jest
        .spyOn(consoleClient, "showError")
        .mockReturnValue(Promise.resolve());

      await sut.run(ctx);

      expect(showErrorSpy).toBeCalledWith(10, "No previous search keywords");
    });

    it("continues a search on the same frame", async () => {
      jest
        .spyOn(findRepository, "getLocalState")
        .mockReturnValue({ keyword, frameId: 100 });
      findNextSpy.mockResolvedValue(true);
      const setLocalStateSpy = jest.spyOn(findRepository, "setLocalState");

      await sut.run(ctx);

      expect(findNextSpy).toBeCalledWith(10, 100, keyword);
      expect(setLocalStateSpy).toBeCalledWith(10, { keyword, frameId: 100 });
    });

    it("continues a search on next frame", async () => {
      jest
        .spyOn(findRepository, "getLocalState")
        .mockReturnValue({ keyword, frameId: 100 });

      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const setLocalStateSpy = jest.spyOn(findRepository, "setLocalState");

      await sut.run(ctx);

      expect(findNextSpy).toBeCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(100);
      expect(findNextSpy.mock.calls[1][1]).toEqual(101);
      expect(clearSelectionSpy).toBeCalledWith(10, 100);
      expect(setLocalStateSpy).toBeCalledWith(10, { keyword, frameId: 101 });
    });

    it("exercise a wrap-search", async () => {
      jest
        .spyOn(findRepository, "getLocalState")
        .mockReturnValue({ keyword, frameId: 101 });

      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const setLocalStateSpy = jest.spyOn(findRepository, "setLocalState");

      await sut.run(ctx);

      expect(findNextSpy).toBeCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(101);
      expect(findNextSpy.mock.calls[1][1]).toEqual(0);
      expect(clearSelectionSpy).toBeCalledWith(10, 101);
      expect(setLocalStateSpy).toBeCalledWith(10, { keyword, frameId: 0 });
    });

    it("starts a search with last keywords", async () => {
      jest.spyOn(findRepository, "getLocalState").mockReturnValue(undefined);
      jest.spyOn(findRepository, "getGlobalKeyword").mockReturnValue(keyword);
      jest.spyOn(consoleClient, "showInfo").mockReturnValue(Promise.resolve());

      const setLocalStateSpy = jest.spyOn(findRepository, "setLocalState");

      await sut.run(ctx);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toBeCalledWith(10, 0, keyword);
      expect(setLocalStateSpy).toBeCalledWith(10, {
        keyword,
        frameId: 0,
      });
    });
  });
});
