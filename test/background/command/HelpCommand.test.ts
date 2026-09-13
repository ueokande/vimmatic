import { describe, expect, it, vi } from "vitest";
import { HelpCommand } from "../../../src/background/command/HelpCommand";

describe("HelpCommand", () => {
  const mockTabsCreate = vi
    .spyOn(chrome.tabs, "create")
    .mockImplementation(() => Promise.resolve({}));

  it("opens help page", async () => {
    const cmd = new HelpCommand();
    await cmd.exec({} as any, false, "");

    expect(mockTabsCreate).toHaveBeenCalledWith({
      url: "https://ueokande.github.io/vimmatic/",
      active: true,
    });
  });
});
