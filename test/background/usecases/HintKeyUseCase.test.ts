import HintKeyUseCaes from "../../../src/background/usecases/HintKeyUseCase";
import MockHintClient from "../mock/MockHintClient";
import MockHintRepository from "../mock/MockHintRepository";
import MockHintActionFactory from "../mock/MockHintActionFactory";
import HintAction from "../../../src/background/hint/HintAction";

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

  const mockPushKey = jest.spyOn(hintRepository, "pushKey").mockResolvedValue();
  const mockPopKey = jest.spyOn(hintRepository, "popKey").mockResolvedValue();
  const mockShowHints = jest.spyOn(hintClient, "showHints").mockResolvedValue();
  const mockActivate = jest.spyOn(mockAction, "activate").mockResolvedValue();

  beforeEach(() => {
    mockPushKey.mockClear();
    mockPopKey.mockClear();
    mockShowHints.mockClear();
    mockActivate.mockClear();
  });

  it("filters pressed key", async () => {
    jest.spyOn(hintRepository, "getTargetFrameIds").mockResolvedValue([0, 1]);
    jest.spyOn(hintRepository, "getAllMatchedHints").mockResolvedValue([
      { frameId: 0, element: "0", tag: "a" },
      { frameId: 0, element: "1", tag: "aa" },
      { frameId: 1, element: "0", tag: "ab" },
    ]);
    jest
      .spyOn(hintRepository, "getMatchedHints")
      .mockImplementation((frameId) => {
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
      });
    jest
      .spyOn(hintActionFactory, "createHintAction")
      .mockReturnValue(mockAction);
    const cont = await sut.pressKey(10, "a");

    expect(cont).toBeTruthy();
    expect(mockPushKey).toBeCalledWith("a");
    expect(mockShowHints).toBeCalledWith(10, 0, ["0", "1"]);
    expect(mockShowHints).toBeCalledWith(10, 1, ["0"]);
    expect(mockActivate).not.toBeCalled();
  });

  it("activate if exactly matched", async () => {
    jest
      .spyOn(hintRepository, "getOption")
      .mockResolvedValue({ newTab: true, background: false });

    jest
      .spyOn(hintRepository, "getAllMatchedHints")
      .mockResolvedValue([{ frameId: 0, element: "0", tag: "a" }]);
    jest
      .spyOn(hintRepository, "getHintModeName")
      .mockResolvedValue("hint.test");
    jest
      .spyOn(hintActionFactory, "createHintAction")
      .mockReturnValue(mockAction);
    const cont = await sut.pressKey(10, "a");

    expect(cont).toBeFalsy();
    expect(mockPushKey).toBeCalledWith("a");
    expect(mockActivate).toBeCalled();
  });

  it("activate when enter pressed", async () => {
    jest
      .spyOn(hintRepository, "getOption")
      .mockResolvedValue({ newTab: true, background: false });
    jest
      .spyOn(hintActionFactory, "createHintAction")
      .mockReturnValue(mockAction);

    jest.spyOn(hintRepository, "getAllMatchedHints").mockResolvedValue([
      { frameId: 0, element: "0", tag: "ab" },
      { frameId: 0, element: "1", tag: "aba" },
      { frameId: 0, element: "2", tag: "abb" },
    ]);
    jest
      .spyOn(hintRepository, "getHintModeName")
      .mockResolvedValue("hint.test");
    jest
      .spyOn(hintActionFactory, "createHintAction")
      .mockReturnValue(mockAction);
    const cont = await sut.pressKey(10, "Enter");

    expect(cont).toBeFalsy();
    expect(mockActivate).toBeCalled();
  });

  it("delete a chatacter when backspace pressed", async () => {
    jest.spyOn(hintRepository, "getTargetFrameIds").mockResolvedValue([0, 1]);
    jest.spyOn(hintRepository, "getAllMatchedHints").mockResolvedValue([
      { frameId: 0, element: "0", tag: "a" },
      { frameId: 0, element: "1", tag: "aa" },
      { frameId: 1, element: "0", tag: "ab" },
    ]);
    jest
      .spyOn(hintRepository, "getMatchedHints")
      .mockImplementation((frameId) => {
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
      });
    const cont = await sut.pressKey(10, "Backspace");

    expect(cont).toBeTruthy();
    expect(mockPopKey).toBeCalled();
    expect(mockShowHints).toBeCalledWith(10, 0, ["0", "1"]);
    expect(mockShowHints).toBeCalledWith(10, 1, ["0"]);
  });
});
