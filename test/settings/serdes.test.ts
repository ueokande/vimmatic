import {
  serializeSettings,
  deserializeSettings,
} from "../../src/settings/serdes";
import Keymaps from "../../src/shared/Keymaps";
import Search from "../../src/shared/Search";
import Blacklist, { BlacklistItem } from "../../src/shared/Blacklist";

describe("serializeSettings", () => {
  it("serializes empty settings", () => {
    const ser = serializeSettings({});
    expect(ser).toEqual({});
  });

  describe("keymaps", () => {
    it("serializes keymap settings", () => {
      const keymaps = new Keymaps({
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
      });
      const ser = serializeSettings({ keymaps });

      expect(ser).toMatchObject({
        keymaps: {
          k: { type: "scroll.vertically", count: -1 },
          j: { type: "scroll.vertically", count: 1 },
        },
      });
    });

    it("serializes empty keymap settings", () => {
      const keymaps = new Keymaps({});
      const ser = serializeSettings({ keymaps });

      expect(ser).toMatchObject({ keymaps: {} });
    });
  });

  describe("search", () => {
    it("serializes search engine settings", () => {
      const search = new Search("google", {
        google: "https://google.com/search?q={}",
        yahoo: "https://search.yahoo.com/search?p={}",
      });
      const ser = serializeSettings({ search });

      expect(ser).toMatchObject({
        search: {
          default: "google",
          engines: {
            google: "https://google.com/search?q={}",
            yahoo: "https://search.yahoo.com/search?p={}",
          },
        },
      });
    });
  });

  describe("blacklist", () => {
    it("serializes blacklist settings", () => {
      const blacklist = new Blacklist([
        new BlacklistItem("example.com", true, ["j", "k"]),
        new BlacklistItem("example.net"),
      ]);
      const ser = serializeSettings({ blacklist });

      expect(ser).toMatchObject({
        blacklist: [{ url: "example.com", keys: ["j", "k"] }, "example.net"],
      });
    });

    it("serializes empty blacklist settings", () => {
      const blacklist = new Blacklist([]);
      const ser = serializeSettings({ blacklist });

      expect(ser).toMatchObject({ blacklist: [] });
    });
  });

  describe("properties", () => {
    it("serializes property settings", () => {
      const properties = {
        smoothscroll: false,
        hintchars: "abcd1234",
      };
      const ser = serializeSettings({ properties });

      expect(ser).toMatchObject({
        properties: {
          smoothscroll: false,
          hintchars: "abcd1234",
        },
      });
    });

    it("serializes empty property settings", () => {
      const properties = {};
      const ser = serializeSettings({ properties });

      expect(ser).toMatchObject({ properties: {} });
    });
  });

  describe("styles", () => {
    it("serializes property settings", () => {
      const styles = {
        hint: {
          "background-color": "yellow",
        },
      };
      const ser = serializeSettings({ styles });

      expect(ser).toMatchObject({
        styles: {
          hint: {
            "background-color": "yellow",
          },
        },
      });
    });

    it("serializes empty property settings", () => {
      const styles = {};
      const ser = serializeSettings({ styles });

      expect(ser).toMatchObject({ styles: {} });
    });
  });
});

describe("deserializeSettings", () => {
  describe("keymaps", () => {
    test("it deserialize keymap settings", () => {
      const keymaps = {
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
      };
      const settings = deserializeSettings({ keymaps });

      expect(settings.keymaps).not.toBeUndefined();
      expect(settings.keymaps.entries()).toMatchObject([
        ["k", { type: "scroll.vertically", count: -1 }],
        ["j", { type: "scroll.vertically", count: 1 }],
      ]);
    });

    test("it deserialize empty keymap settings", () => {
      const keymaps = {};
      const settings = deserializeSettings({ keymaps });

      expect(settings.keymaps).not.toBeUndefined();
      expect(settings.keymaps.entries()).toHaveLength(0);
    });
  });

  describe("search", () => {
    test("it deserialize search engine settings", () => {
      const search = {
        default: "google",
        engines: {
          google: "https://google.com/search?q={}",
          yahoo: "https://search.yahoo.com/search?p={}",
        },
      };
      const settings = deserializeSettings({ search });

      expect(settings.search.defaultEngine).toBe("google");
      expect(settings.search.engines).toMatchObject({
        google: "https://google.com/search?q={}",
        yahoo: "https://search.yahoo.com/search?p={}",
      });
    });

    test("it throws an error on invalid search engine settings", () => {
      expect(() =>
        deserializeSettings({
          search: {
            default: "wikipedia",
            engines: {
              google: "https://google.com/search?q={}",
              yahoo: "https://search.yahoo.com/search?p={}",
            },
          },
        })
      ).toThrow(TypeError);
      expect(() =>
        deserializeSettings({
          search: {
            default: "g o o g l e",
            engines: {
              "g o o g l e": "https://google.com/search?q={}",
            },
          },
        })
      ).toThrow(TypeError);
      expect(() =>
        deserializeSettings({
          search: {
            default: "google",
            engines: {
              google: "https://google.com/search",
            },
          },
        })
      ).toThrow(TypeError);
      expect(() =>
        deserializeSettings({
          search: {
            default: "google",
            engines: {
              google: "https://google.com/search?q={}&r={}",
            },
          },
        })
      ).toThrow(TypeError);
    });
  });

  describe("blacklist", () => {
    test("it deserialize blacklist settings", () => {
      const blacklist = [
        { url: "example.com", keys: ["j", "k"] },
        "example.net",
      ];
      const settings = deserializeSettings({ blacklist });

      expect(settings.blacklist).not.toBeUndefined();
      expect(settings.blacklist.items).toHaveLength(2);
      expect(settings.blacklist.items[0].pattern).toBe("example.com");
      expect(settings.blacklist.items[0].partial).toBeTruthy();
      expect(settings.blacklist.items[0].keys).toEqual(["j", "k"]);
      expect(settings.blacklist.items[1].pattern).toBe("example.net");
      expect(settings.blacklist.items[1].partial).toBeFalsy();
    });

    test("it deserialize empty blacklist settings", () => {
      const blacklist = [];
      const settings = deserializeSettings({ blacklist });

      expect(settings.blacklist).not.toBeUndefined();
      expect(settings.blacklist.items).toHaveLength(0);
    });
  });

  describe("properties", () => {
    test("it deserialize properties settings", () => {
      const properties = {
        hintchars: "abcd1234",
        smoothscroll: false,
      };
      const settings = deserializeSettings({ properties });

      expect(settings.properties).toMatchObject({
        hintchars: "abcd1234",
        smoothscroll: false,
      });
    });

    test("it deserialize empty properties settings", () => {
      const properties = {};
      const settings = deserializeSettings({ properties });

      expect(settings.properties).toEqual({});
    });
  });

  describe("styles", () => {
    test("it deserialize styles settings", () => {
      const styles = {
        hint: {
          "background-color": "yellow",
        },
      };
      const settings = deserializeSettings({ styles });

      expect(settings.styles.hint).toMatchObject({
        "background-color": "yellow",
      });
    });

    test("it deserialize empty styles settings", () => {
      const styles = {};
      const settings = deserializeSettings({ styles });

      expect(settings.styles).toEqual({});
    });
  });
});
