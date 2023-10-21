import Blacklist, { BlacklistItem } from "../../src/shared/Blacklist";
import { fromKeymap } from "../../src/shared/Key";

describe("BlacklistItem", () => {
  describe("#matches", () => {
    it('matches by "*"', () => {
      const item = new BlacklistItem("*");
      expect(item.matches(new URL("https://github.com/abc"))).toBeTruthy;
    });

    it("matches by hostname", () => {
      const item = new BlacklistItem("github.com");
      expect(item.matches(new URL("https://github.com"))).toBeTruthy;
      expect(item.matches(new URL("https://gist.github.com"))).toBeFalsy;
      expect(item.matches(new URL("https://github.com/ueokande"))).toBeTruthy;
      expect(item.matches(new URL("https://github.org"))).toBeFalsy;
      expect(item.matches(new URL("https://google.com/search?q=github.org")))
        .toBeFalsy;
    });

    it("matches by hostname with wildcard", () => {
      const item = new BlacklistItem("*.github.com");

      expect(item.matches(new URL("https://github.com"))).toBeFalsy;
      expect(item.matches(new URL("https://gist.github.com"))).toBeTruthy;
    });

    it("matches by path", () => {
      const item = new BlacklistItem("github.com/abc");

      expect(item.matches(new URL("https://github.com/abc"))).toBeTruthy;
      expect(item.matches(new URL("https://github.com/abcdef"))).toBeFalsy;
      expect(item.matches(new URL("https://gist.github.com/abc"))).toBeFalsy;
    });

    it("matches by path with wildcard", () => {
      const item = new BlacklistItem("github.com/abc*");

      expect(item.matches(new URL("https://github.com/abc"))).toBeTruthy;
      expect(item.matches(new URL("https://github.com/abcdef"))).toBeTruthy;
      expect(item.matches(new URL("https://gist.github.com/abc"))).toBeFalsy;
    });

    it("matches address and port", () => {
      const item = new BlacklistItem("127.0.0.1:8888");

      expect(item.matches(new URL("http://127.0.0.1:8888/"))).toBeTruthy;
      expect(item.matches(new URL("http://127.0.0.1:8888/hello"))).toBeTruthy;
    });

    it("matches with partial blacklist", () => {
      const item = new BlacklistItem("google.com", true, ["j", "k"]);

      expect(item.matches(new URL("https://google.com"))).toBeTruthy;
      expect(item.matches(new URL("https://yahoo.com"))).toBeFalsy;
    });
  });

  describe("#includesPartialKeys", () => {
    it("matches with partial keys", () => {
      const item = new BlacklistItem("google.com", true, ["j", "k", "<C-U>"]);

      expect(
        item.includeKey(new URL("http://google.com/maps"), fromKeymap("j")),
      ).toBeTruthy;
      expect(
        item.includeKey(new URL("http://google.com/maps"), fromKeymap("<C-U>")),
      ).toBeTruthy;
      expect(
        item.includeKey(new URL("http://google.com/maps"), fromKeymap("z")),
      ).toBeFalsy;
      expect(
        item.includeKey(new URL("http://google.com/maps"), fromKeymap("u")),
      ).toBeFalsy;
      expect(
        item.includeKey(new URL("http://maps.google.com/"), fromKeymap("j")),
      ).toBeFalsy;
    });
  });
});

describe("Blacklist", () => {
  describe("#includesEntireBlacklist", () => {
    it("matches a url with entire blacklist", () => {
      const blacklist = new Blacklist([
        new BlacklistItem("google.com"),
        new BlacklistItem("*.github.com"),
      ]);
      expect(blacklist.includesEntireBlacklist(new URL("https://google.com")))
        .toBeTruthy;
      expect(blacklist.includesEntireBlacklist(new URL("https://github.com")))
        .toBeFalsy;
      expect(
        blacklist.includesEntireBlacklist(new URL("https://gist.github.com")),
      ).toBeTruthy;
    });

    it("does not matches with partial blacklist", () => {
      const blacklist = new Blacklist([
        new BlacklistItem("google.com"),
        new BlacklistItem("yahoo.com", true, ["j", "k"]),
      ]);
      expect(blacklist.includesEntireBlacklist(new URL("https://google.com")))
        .toBeTruthy;
      expect(blacklist.includesEntireBlacklist(new URL("https://yahoo.com")))
        .toBeFalsy;
    });
  });

  describe("#includesKeys", () => {
    it("matches with entire blacklist or keys in the partial blacklist", () => {
      const blacklist = new Blacklist([
        new BlacklistItem("google.com"),
        new BlacklistItem("github.com", true, ["j", "k"]),
      ]);

      expect(
        blacklist.includeKey(new URL("https://google.com"), fromKeymap("j")),
      ).toBeFalsy;
      expect(
        blacklist.includeKey(new URL("https://github.com"), fromKeymap("j")),
      ).toBeTruthy;
      expect(
        blacklist.includeKey(new URL("https://github.com"), fromKeymap("a")),
      ).toBeFalsy;
    });
  });

  describe("#combined", () => {});
});
