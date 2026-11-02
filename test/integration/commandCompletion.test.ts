import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BufferCommand } from "../../src/background/command/BufferCommand";
import { BufferDeleteCommand } from "../../src/background/command/BufferDeleteCommand";
import { BufferDeletesCommand } from "../../src/background/command/BufferDeletesCommand";
import { CommandRegistryImpl } from "../../src/background/command/CommandRegistry";
import { OpenCommand } from "../../src/background/command/OpenCommand";
import { SetCommand } from "../../src/background/command/SetCommand";
import { TabOpenCommand } from "../../src/background/command/TabOpenCommand";
import { TabQueryHelper } from "../../src/background/command/TabQueryHelper";
import { WindowOpenCommand } from "../../src/background/command/WindowOpenCommand";
import { ColorSchemeProperty } from "../../src/background/property/ColorSchemeProperty";
import { CompleteProperty } from "../../src/background/property/CompleteProperty";
import { HintcharsProperty } from "../../src/background/property/HintcharsProperty";
import { PropertyRegistryImpl } from "../../src/background/property/PropertyRegistry";
import { SmoothScrollProperty } from "../../src/background/property/SmoothScrollProperty";
import { PropertySettingsImpl } from "../../src/background/settings/PropertySettings";
import { SearchEngineSettingsImpl } from "../../src/background/settings/SearchEngineSettings";
import {
  PermanentSettingsRepositoryImpl,
  TransientSettingsRepositoryImpl,
} from "../../src/background/settings/SettingsRepository";
import { CommandUseCase } from "../../src/background/usecases/CommandUseCase";
import type { SerializedSettings } from "../../src/settings/schema";
import { MockConsoleClient } from "../background/mock/MockConsoleClient";
import { MockLocalStorage } from "../background/mock/MockLocalStorage";

// Only browser APIs and local persistence are replaced; parsing, commands,
// completion helpers and settings resolution run together.
describe("command completion integration", () => {
  let sut: CommandUseCase;
  let saved: SerializedSettings;
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  const names = async (query: string) =>
    (await sut.getCompletions(query)).flatMap((g) =>
      g.items.map((i) => i.primary),
    );

  beforeEach(() => {
    saved = {
      search: {
        default: "local",
        engines: { local: "https://search.test/?q={}" },
      },
    };
    vi.spyOn(chrome.storage.sync, "get").mockImplementation(async () => ({
      settings: saved,
    }));
    // The repository subscribes to the real storage boundary.
    vi.stubGlobal("chrome", {
      ...chrome,
      storage: { ...chrome.storage, onChanged: { addListener: vi.fn() } },
    });
    vi.spyOn(chrome.runtime, "getURL").mockImplementation(
      (path) => `chrome-extension://test/${path}`,
    );
    const tabs = [
      {
        id: 1,
        index: 0,
        title: "Site A",
        url: "https://tabs.test/a",
        pinned: true,
        active: false,
      },
      {
        id: 2,
        index: 1,
        title: "Site B",
        url: "https://tabs.test/b",
        pinned: true,
        active: false,
      },
      {
        id: 3,
        index: 2,
        title: "Current",
        url: "https://tabs.test/current",
        pinned: false,
        active: true,
      },
      {
        id: 4,
        index: 3,
        title: "Site C",
        url: "https://tabs.test/c",
        pinned: false,
        active: false,
      },
      {
        id: 5,
        index: 4,
        title: "Site D",
        url: "https://tabs.test/d",
        pinned: false,
        active: false,
      },
    ] as chrome.tabs.Tab[];
    vi.spyOn(chrome.tabs, "query").mockImplementation(async (query) =>
      tabs.filter(
        (tab) => query.pinned === undefined || tab.pinned === query.pinned,
      ),
    );
    vi.spyOn(chrome.bookmarks, "search").mockImplementation(async () => [
      { id: "1", title: "Getting Started", url: "https://bookmarks.test/" },
    ]);
    vi.spyOn(chrome.history, "search").mockImplementation(async () => [
      {
        id: "1",
        title: "History",
        url: "https://history.test/",
        visitCount: 1,
      },
    ]);
    const properties = new PropertyRegistryImpl();
    for (const property of [
      new HintcharsProperty(),
      new SmoothScrollProperty(),
      new CompleteProperty(),
      new ColorSchemeProperty(),
    ])
      properties.register(property);
    const settings = new TransientSettingsRepositoryImpl(
      new PermanentSettingsRepositoryImpl(),
      new MockLocalStorage<SerializedSettings | undefined>(undefined),
    );
    const propertySettings = new PropertySettingsImpl(settings, properties);
    const search = new SearchEngineSettingsImpl(settings);
    const lastTab = {
      getLastSelectedTabId: async () => 4,
      setCurrentTabId: async () => {},
    };
    const helper = new TabQueryHelper(lastTab);
    const registry = new CommandRegistryImpl();
    for (const command of [
      new BufferCommand(lastTab, helper),
      new BufferDeleteCommand(helper),
      new BufferDeletesCommand(helper),
      new OpenCommand(search, propertySettings),
      new TabOpenCommand(search, propertySettings),
      new WindowOpenCommand(search, propertySettings),
      new SetCommand(propertySettings, properties, new MockConsoleClient()),
    ])
      registry.register(command);
    sut = new CommandUseCase(registry);
  });

  it("lists registered commands and filters by prefix", async () => {
    expect(await names("")).toEqual([
      "buffer",
      "bdelete",
      "bdeletes",
      "open",
      "tabopen",
      "winopen",
      "set",
    ]);
    expect(await names("b")).toEqual(["buffer", "bdelete", "bdeletes"]);
  });

  it("lists tabs with current and previous selection flags", async () => {
    expect(await names("buffer ")).toEqual([
      "1:   Site A",
      "2:   Site B",
      "3: % Current",
      "4: # Site C",
      "5:   Site D",
    ]);
  });
  it.each([
    ["buffer /b", ["2:   Site B"]],
    [
      "buffer Site",
      ["1:   Site A", "2:   Site B", "4: # Site C", "5:   Site D"],
    ],
    ["buffer 2", ["2:   Site B"]],
    ["bdelete Site", ["4: # Site C", "5:   Site D"]],
    ["bdeletes Site", ["4: # Site C", "5:   Site D"]],
    [
      "bdelete! Site",
      ["1:   Site A", "2:   Site B", "4: # Site C", "5:   Site D"],
    ],
    [
      "bdeletes! Site",
      ["1:   Site A", "2:   Site B", "4: # Site C", "5:   Site D"],
    ],
  ])("filters tab candidates for %s", async (query, expected) => {
    expect(await names(query)).toEqual(expected);
  });

  it("combines search engines, bookmarks and history", async () => {
    const groups = await sut.getCompletions("open ");
    expect(groups.map((g) => g.name)).toEqual([
      "Search Engines",
      "Bookmarks",
      "History",
    ]);
    expect(groups.map((g) => g.items.map((i) => i.value))).toEqual([
      ["open local"],
      ["open https://bookmarks.test/"],
      ["open https://history.test/"],
    ]);
  });

  it.each(["open", "tabopen", "winopen"])(
    "routes %s bookmark queries to the browser and prefixes selected values",
    async (command) => {
      const groups = await sut.getCompletions(`${command} getting`);
      expect(chrome.bookmarks.search).toHaveBeenCalledWith({
        query: "getting",
      });
      expect(groups.find((g) => g.name === "Bookmarks")?.items).toMatchObject([
        {
          primary: "Getting Started",
          value: `${command} https://bookmarks.test/`,
        },
      ]);
      expect(chrome.history.search).toHaveBeenCalledWith({
        text: "getting",
        startTime: 0,
      });
    },
  );

  it("uses completion ordering from persisted settings", async () => {
    saved.properties = { complete: "bss" };
    expect((await sut.getCompletions("open ")).map((g) => g.name)).toEqual([
      "Bookmarks",
      "Search Engines",
      "Search Engines",
    ]);
  });

  it("applies set complete to the next completion query", async () => {
    await sut.exec(
      {
        sender: { tab: { id: 3 }, frameId: 0 } as chrome.runtime.MessageSender,
      },
      "set complete=bss",
    );
    expect((await sut.getCompletions("open ")).map((g) => g.name)).toEqual([
      "Bookmarks",
      "Search Engines",
      "Search Engines",
    ]);
  });

  it("completes real property names and their negated forms", async () => {
    expect(await names("set ")).toEqual([
      "hintchars",
      "smoothscroll",
      "nosmoothscroll",
      "complete",
      "colorscheme",
    ]);
    expect(await names("set no")).toEqual(["nosmoothscroll"]);
  });
});
