import AddBookmarkCommand from "../../../src/background/command/AddBookmarkCommand";
import MockConsoleClient from "../mock/MockConsoleClient";

describe("AddBookmarkCommand", () => {
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
    mockBookmarkCreate.mockClear();
    mockShowInfo.mockClear();

    mockBookmarkCreate.mockResolvedValue({
      id: "100",
      title: "dummy",
    });
    mockShowInfo.mockResolvedValue({});
  });

  it("adds a bookmark with specific title", async () => {
    const ctx = {
      sender: {
        tabId: 10,
        frameId: 0,
        tab: {
          title: "example",
          url: "https://example.com",
          ...defaultTabProps,
        },
      },
    };
    const cmd = new AddBookmarkCommand(consoleClient);
    await cmd.exec(ctx, false, "my title");

    expect(mockBookmarkCreate).toHaveBeenCalledWith({
      type: "bookmark",
      title: "my title",
      url: "https://example.com",
    });
    expect(mockShowInfo).toHaveBeenCalledTimes(1);
  });

  it("adds a bookmark with the tab title", async () => {
    const ctx = {
      sender: {
        tabId: 10,
        frameId: 0,
        tab: {
          title: "example",
          url: "https://example.com",
          ...defaultTabProps,
        },
      },
    };
    const cmd = new AddBookmarkCommand(consoleClient);
    await cmd.exec(ctx, false, "");

    expect(mockBookmarkCreate).toHaveBeenCalledWith({
      type: "bookmark",
      title: "example",
      url: "https://example.com",
    });
    expect(mockShowInfo).toHaveBeenCalledTimes(1);
  });

  it("adds a bookmark with the tab url", async () => {
    const ctx = {
      sender: {
        tabId: 10,
        frameId: 0,
        tab: {
          url: "https://example.com",
          ...defaultTabProps,
        },
      },
    };

    const cmd = new AddBookmarkCommand(consoleClient);
    await cmd.exec(ctx, false, "");

    expect(mockBookmarkCreate).toHaveBeenCalledWith({
      type: "bookmark",
      title: "https://example.com",
      url: "https://example.com",
    });
    expect(mockShowInfo).toHaveBeenCalledTimes(1);
  });
});
