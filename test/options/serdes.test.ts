import {
  settingsToForm,
  settingsFromForm,
  settingsToText,
  settingsFromText,
} from "../../src/options/serdes";
import Keymaps from "../../src/shared/Keymaps";
import Search from "../../src/shared/Search";
import Blacklist, { BlacklistItem } from "../../src/shared/Blacklist";

describe("settingsToForm", () => {
  it("converts empty settings to form", () => {
    const form = settingsToForm({});

    expect(form).toEqual({});
  });

  describe("keymaps", () => {
    it("converts keymap settings to form", () => {
      const keymaps = new Keymaps({
        j: { type: "scroll.vertically", count: 1 },
        "0": { type: "scroll.home" },
      });
      const form = settingsToForm({ keymaps });

      expect(form).toEqual({
        keymaps: {
          'scroll.vertically?{"count":1}': "j",
          "scroll.home": "0",
        },
      });
    });

    it("converts empty keymap settings to form", () => {
      const keymaps = new Keymaps({});
      const form = settingsToForm({ keymaps });

      expect(form).toEqual({ keymaps: {} });
    });
  });

  describe("search", () => {
    it("converts search settings to form", () => {
      const search = new Search("google", {
        google: "https://google.com/search?q={}",
        yahoo: "https://yahoo.com/search?q={}",
      });
      const form = settingsToForm({ search });

      expect(form.search.default).toBe("google");
      expect(form.search.engines).toMatchObject([
        { name: "google", url: "https://google.com/search?q={}" },
        { name: "yahoo", url: "https://yahoo.com/search?q={}" },
      ]);
    });
  });

  describe("properties", () => {
    it("converts property settings to form", () => {
      const properties = {
        smoothscroll: false,
        hintchars: "abcdefghijklmnopqrstuvwxyz",
      };
      const form = settingsToForm({ properties });

      expect(form.properties).toMatchObject({
        smoothscroll: false,
        hintchars: "abcdefghijklmnopqrstuvwxyz",
      });
    });

    it("converts empty property settings to form", () => {
      const properties = {};
      const form = settingsToForm({ properties });

      expect(form.properties).toEqual({});
    });
  });
  describe("blacklist", () => {
    it("converts blacklist settings to form", () => {
      const blacklist = new Blacklist([
        new BlacklistItem("example.com", true, ["j", "k"]),
        new BlacklistItem("example.net"),
      ]);
      const form = settingsToForm({ blacklist });

      expect(form.fullBlacklist).toMatchObject(["example.net"]);
      expect(form.partialBlacklist).toMatchObject([
        { pattern: "example.com", keys: ["j", "k"] },
      ]);
    });
  });
});

describe("settingsFromForm", () => {
  it("converts empty settings from form", () => {
    const settings = settingsFromForm({});

    expect(settings).toEqual({});
  });

  describe("keymaps", () => {
    it("converts keymap settings from form", () => {
      const keymaps = {
        'scroll.vertically?{"count":1}': "j",
        "scroll.home": "0",
      };
      const settings = settingsFromForm({ keymaps });

      expect(settings.keymaps.entries()).toEqual([
        ["0", { type: "scroll.home" }],
        ["j", { type: "scroll.vertically", count: 1 }],
      ]);
    });

    it("converts empty keymap settings from form", () => {
      const keymaps = {};
      const settings = settingsFromForm({ keymaps });

      expect(settings.keymaps.entries()).toEqual([]);
    });
  });

  describe("search", () => {
    it("converts search settings from form", () => {
      const search = {
        default: "google",
        engines: [
          { name: "google", url: "https://google.com/search?q={}" },
          { name: "yahoo", url: "https://yahoo.com/search?q={}" },
        ],
      };
      const settings = settingsFromForm({ search });

      expect(settings.search.defaultEngine).toBe("google");
      expect(settings.search.engines).toMatchObject({
        google: "https://google.com/search?q={}",
        yahoo: "https://yahoo.com/search?q={}",
      });
    });
  });

  describe("properties", () => {
    it("converts property settings from form", () => {
      const properties = {
        hintchars: "abcd1234",
        smoothscroll: false,
      };
      const settings = settingsFromForm({ properties });

      expect(settings.properties).toEqual({
        hintchars: "abcd1234",
        smoothscroll: false,
      });
    });

    it("converts empty property settings from form", () => {
      const properties = {};
      const settings = settingsFromForm({ properties });

      expect(settings.properties).toEqual({});
    });
  });

  describe("blacklist", () => {
    it("converts blacklist settings from form", () => {
      const fullBlacklist = ["example.net"];
      const partialBlacklist = [{ pattern: "example.com", keys: ["j", "k"] }];
      const blacklist = settingsFromForm({ fullBlacklist, partialBlacklist });

      expect(blacklist.blacklist.items).toHaveLength(2);
      expect(blacklist.blacklist.items[0].pattern).toBe("example.net");
      expect(blacklist.blacklist.items[0].partial).toBeFalsy();
      expect(blacklist.blacklist.items[1].pattern).toBe("example.com");
      expect(blacklist.blacklist.items[1].partial).toBeTruthy();
      expect(blacklist.blacklist.items[1].keys).toEqual(["j", "k"]);
    });

    it("converts empty blacklist settings from form", () => {
      const properties = {};
      const settings = settingsFromForm({ properties });

      expect(settings.properties).toEqual({});
    });
  });
});

describe("settingsToText", () => {
  it("converts empty settings to text", () => {
    const text = settingsToText({});

    expect(text).toEqual("{}");
  });

  it("converts settings to text", () => {
    const text = settingsToText({
      blacklist: new Blacklist([new BlacklistItem("example.com")]),
    });

    expect(text).toEqual(`{
  "blacklist": [
    "example.com"
  ]
}`);
  });
});

describe("settingsFromText", () => {
  it("converts empty settings from text", () => {
    const settings = settingsFromText("{}");

    expect(settings).toEqual({});
  });

  it("converts settings from text", () => {
    const settings = settingsFromText(`{ "blacklist": [ "example.com" ] }`);
    expect(settings.blacklist).not.toBeUndefined();
    expect(settings.blacklist.items).toHaveLength(1);
    expect(settings.blacklist.items[0].pattern).toBe("example.com");
  });

  it("raise error on invalid text", () => {
    expect(() => settingsFromText(`{`)).toThrowError();
    expect(() => settingsFromText(`{ "search": {} }`)).toThrowError();
    expect(() =>
      settingsFromText(`{ "blacklist": "google.com" }`)
    ).toThrowError();
  });
});
