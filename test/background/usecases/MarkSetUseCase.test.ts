import MarkSetUseCase from "../../../src/background/usecases/MarkSetUseCase";
import MockConsoleClient from "../mock/MockConsoleClient";
import MockContentMessageClient from "../mock/MockContentMessageClient";
import MockMarkRepository from "../mock/MockMarkRepository";
import MarkHelper from "../../../src/background/usecases/MarkHelper";

describe("MarkSetUseCase", () => {
  const markRepository = new MockMarkRepository();
  const consoleClient = new MockConsoleClient();
  const contentMessageClient = new MockContentMessageClient();
  const markHelper = new MarkHelper();
  const sut = new MarkSetUseCase(
    markRepository,
    consoleClient,
    contentMessageClient,
    markHelper
  );

  beforeAll(() => {
    jest
      .spyOn(browser.tabs, "query")
      .mockResolvedValue([
        { id: 100, url: "https://example.com/" } as browser.tabs.Tab,
      ]);
  });

  it("sets global marks", async () => {
    jest
      .spyOn(contentMessageClient, "getScroll")
      .mockResolvedValue({ x: 10, y: 20 });
    const mockSetGlobalMark = jest
      .spyOn(markRepository, "setGlobalMark")
      .mockResolvedValue();
    const mockShowInfo = jest
      .spyOn(consoleClient, "showInfo")
      .mockResolvedValue(undefined);

    await sut.setMark("A");

    expect(mockSetGlobalMark).toHaveBeenCalledWith("A", {
      tabId: 100,
      url: "https://example.com/",
      x: 10,
      y: 20,
    });
    expect(mockShowInfo).toHaveBeenCalledWith(100, "Set global mark to 'A'");
  });

  it("sets local marks", async () => {
    jest
      .spyOn(contentMessageClient, "getScroll")
      .mockResolvedValue({ x: 10, y: 20 });
    const mockSetGlobalMark = jest
      .spyOn(markRepository, "setLocalMark")
      .mockResolvedValue();
    const mockShowInfo = jest
      .spyOn(consoleClient, "showInfo")
      .mockResolvedValue(undefined);

    await sut.setMark("a");

    expect(mockSetGlobalMark).toHaveBeenCalledWith(100, "a", {
      x: 10,
      y: 20,
    });
    expect(mockShowInfo).toHaveBeenCalledWith(100, "Set local mark to 'a'");
  });
});
