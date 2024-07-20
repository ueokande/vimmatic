import { AddBookmarkCommand } from "../../../src/background/command/AddBookmarkCommand";
import { MockConsoleClient } from "../mock/MockConsoleClient";
import { defaultTab } from "../mock/defaultTab";
import { describe, expect, vi, it, beforeEach } from "vitest";

describe("AddBookmarkCommand", () => {
  const mockBookmarkCreate = vi
    .spyOn(chrome.bookmarks, "create")
    .mockImplementation(() => {});
  const consoleClient = new MockConsoleClient();
  const mockShowInfo = vi.spyOn(consoleClient, "showInfo");

  beforeEach(() => {
    mockBookmarkCreate.mockClear();
    mockShowInfo.mockClear();

    mockBookmarkCreate.mockImplementation(() =>
      Promise.resolve({
        id: "100",
        title: "dummy",
      }),
    );
    mockShowInfo.mockResolvedValue();
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
