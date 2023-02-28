import HelpCommand from "../../../src/background/command/HelpCommand";

describe("HelpCommand", () => {
  const mockTabsCreate = jest.spyOn(browser.tabs, "create");

  beforeEach(() => {
    mockTabsCreate.mockClear();
  });

  it("opens help page", async () => {
    mockTabsCreate.mockResolvedValue({} as any);

    const cmd = new HelpCommand();
    await cmd.exec({} as any, false, "");

    expect(mockTabsCreate).toHaveBeenCalledWith({
      url: "https://ueokande.github.io/vimmatic/",
      active: true,
    });
  });
});
