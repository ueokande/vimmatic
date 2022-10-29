import AddBookmarkCommand from "../../../src/background/command/AddBookmarkCommand";
import MockConsoleClient from "../mock/MockConsoleClient";

describe("AddBookmarkCommand", () => {
  const mockTabsQuery = jest.spyOn(browser.tabs, "query");
  const mockBookmarkCreate = jest.spyOn(browser.bookmarks, "create");
  const consoleClient = new MockConsoleClient();
  const mockShowInfo = jest.spyOn(consoleClient, "showInfo");

  const defaultTabProps = {
    id: 10,
    index: 0,
    highlighted: false,
    active: true,
    pinned: false,
    incognito: false,
  };

  beforeEach(() => {
    mockTabsQuery.mockClear();
    mockBookmarkCreate.mockClear();
    mockShowInfo.mockClear();

    mockBookmarkCreate.mockResolvedValue({
      id: "100",
      title: "dummy",
    });
    mockShowInfo.mockResolvedValue({});
  });

  it("adds a bookmark with specific title", async () => {
    mockTabsQuery.mockResolvedValue([
      {
        title: "example",
        url: "https://example.com",
        ...defaultTabProps,
      },
    ]);

    const cmd = new AddBookmarkCommand(consoleClient);
    await cmd.exec(false, "my title");

    expect(mockBookmarkCreate).toHaveBeenCalledWith({
      type: "bookmark",
      title: "my title",
      url: "https://example.com",
    });
    expect(mockShowInfo).toHaveBeenCalledTimes(1);
  });

  it("adds a bookmark with the tab title", async () => {
    mockTabsQuery.mockResolvedValue([
      {
        title: "example",
        url: "https://example.com",
        ...defaultTabProps,
      },
    ]);

    const cmd = new AddBookmarkCommand(consoleClient);
    await cmd.exec(false, "");

    expect(mockBookmarkCreate).toHaveBeenCalledWith({
      type: "bookmark",
      title: "example",
      url: "https://example.com",
    });
    expect(mockShowInfo).toHaveBeenCalledTimes(1);
  });

  it("adds a bookmark with the tab url", async () => {
    mockTabsQuery.mockResolvedValue([
      {
        url: "https://example.com",
        ...defaultTabProps,
      },
    ]);

    const cmd = new AddBookmarkCommand(consoleClient);
    await cmd.exec(false, "");

    expect(mockBookmarkCreate).toHaveBeenCalledWith({
      type: "bookmark",
      title: "https://example.com",
      url: "https://example.com",
    });
    expect(mockShowInfo).toHaveBeenCalledTimes(1);
  });
});
