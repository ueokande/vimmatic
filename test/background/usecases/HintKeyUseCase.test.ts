import HintKeyUseCaes from "../../../src/background/usecases/HintKeyUseCase";
import MockHintClient from "../mock/MockHintClient";
import MockHintRepository from "../mock/MockHintRepository";

describe("HintKeyUseCaes", () => {
  it("filters pressed key 1", async () => {
    const hintClient = new MockHintClient();
    const hintRepository = new MockHintRepository();
    const sut = new HintKeyUseCaes(hintClient, hintRepository);

    const mockPushKey = jest
      .spyOn(hintRepository, "pushKey")
      .mockResolvedValue();
    const mockFilterHints = jest
      .spyOn(hintClient, "filterHints")
      .mockResolvedValue();

    jest.spyOn(hintRepository, "getKeys").mockResolvedValue("a");
    jest
      .spyOn(hintRepository, "getMatchedHints")
      .mockResolvedValue(["a", "aa", "ab"]);
    const cont = await sut.pressKey(10, "a");

    expect(cont).toBeTruthy();
    expect(mockPushKey).toBeCalledWith("a");
    expect(mockFilterHints).toBeCalledWith(10, "a");
  });

  it("filters pressed key 2", async () => {
    const hintClient = new MockHintClient();
    const hintRepository = new MockHintRepository();
    const sut = new HintKeyUseCaes(hintClient, hintRepository);

    const mockPushKey = jest
      .spyOn(hintRepository, "pushKey")
      .mockResolvedValue();
    const mockFilterHints = jest
      .spyOn(hintClient, "filterHints")
      .mockResolvedValue();

    jest.spyOn(hintRepository, "getKeys").mockResolvedValue("ab");
    jest
      .spyOn(hintRepository, "getMatchedHints")
      .mockResolvedValue(["ab", "aba", "abb"]);
    const cont = await sut.pressKey(10, "b");

    expect(cont).toBeTruthy();
    expect(mockPushKey).toBeCalledWith("b");
    expect(mockFilterHints).toBeCalledWith(10, "ab");
  });

  it("activate if exactly matched", async () => {
    const hintClient = new MockHintClient();
    const hintRepository = new MockHintRepository();
    const sut = new HintKeyUseCaes(hintClient, hintRepository);

    const mockPushKey = jest
      .spyOn(hintRepository, "pushKey")
      .mockResolvedValue();
    jest
      .spyOn(hintRepository, "getOption")
      .mockResolvedValue({ newTab: true, background: false });
    const mockActivateIfExists = jest
      .spyOn(hintClient, "activateIfExists")
      .mockResolvedValue();

    jest.spyOn(hintRepository, "getKeys").mockResolvedValue("ab");
    jest.spyOn(hintRepository, "getMatchedHints").mockResolvedValue(["ab"]);
    const cont = await sut.pressKey(10, "b");

    expect(cont).toBeFalsy();
    expect(mockPushKey).toBeCalledWith("b");
    expect(mockActivateIfExists).toBeCalledWith(10, "ab", true, false);
  });

  it("activate when enter pressed", async () => {
    const hintClient = new MockHintClient();
    const hintRepository = new MockHintRepository();
    const sut = new HintKeyUseCaes(hintClient, hintRepository);

    jest
      .spyOn(hintRepository, "getOption")
      .mockResolvedValue({ newTab: true, background: false });
    const mockActivateIfExists = jest
      .spyOn(hintClient, "activateIfExists")
      .mockResolvedValue();

    jest.spyOn(hintRepository, "getKeys").mockResolvedValue("ab");
    jest
      .spyOn(hintRepository, "getMatchedHints")
      .mockResolvedValue(["ab", "aba", "abb"]);
    const cont = await sut.pressKey(10, "Enter");

    expect(cont).toBeFalsy();
    expect(mockActivateIfExists).toBeCalledWith(10, "ab", true, false);
  });

  it("delete a chatacter when backspace pressed", async () => {
    const hintClient = new MockHintClient();
    const hintRepository = new MockHintRepository();
    const sut = new HintKeyUseCaes(hintClient, hintRepository);

    const mockPopKey = jest.spyOn(hintRepository, "popKey").mockResolvedValue();
    const mockFilterHints = jest
      .spyOn(hintClient, "filterHints")
      .mockResolvedValue();

    jest.spyOn(hintRepository, "getKeys").mockResolvedValue("ab");
    jest
      .spyOn(hintRepository, "getMatchedHints")
      .mockResolvedValue(["ab", "aba", "abb"]);
    const cont = await sut.pressKey(10, "Backspace");

    expect(cont).toBeTruthy();
    expect(mockPopKey).toBeCalled();
    expect(mockFilterHints).toBeCalledWith(10, "ab");
  });
});
