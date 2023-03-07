import AddBookmarkCommand from "../../../src/background/command/AddBookmarkCommand";
import MockConsoleClient from "../mock/MockConsoleClient";
import defaultTab from "../mock/defaultTab";

describe("AddBookmarkCommand", () => {
  const mockBookmarkCreate = jest.spyOn(chrome.bookmarks, "create");
  const consoleClient = new MockConsoleClient();
  const mockShowInfo = jest.spyOn(consoleClient, "showInfo");

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
          ...defaultTab,
          id: 10,
          title: "example",
          url: "https://example.com",
        },
      },
    };
    const cmd = new AddBookmarkCommand(consoleClient);
    await cmd.exec(ctx, false, "my title");

    expect(mockBookmarkCreate).toHaveBeenCalledWith({
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
          ...defaultTab,
          id: 10,
          title: "example",
          url: "https://example.com",
        },
      },
    };
    const cmd = new AddBookmarkCommand(consoleClient);
    await cmd.exec(ctx, false, "");

    expect(mockBookmarkCreate).toHaveBeenCalledWith({
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
          ...defaultTab,
          id: 10,
          title: undefined,
          url: "https://example.com",
        },
      },
    };

    const cmd = new AddBookmarkCommand(consoleClient);
    await cmd.exec(ctx, false, "");

    expect(mockBookmarkCreate).toHaveBeenCalledWith({
      title: "https://example.com",
      url: "https://example.com",
    });
    expect(mockShowInfo).toHaveBeenCalledTimes(1);
  });
});
