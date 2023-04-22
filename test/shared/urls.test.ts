import * as parsers from "../../src/shared/urls";
import Search from "../../src/shared/Search";

describe("shared/commands/parsers", () => {
  describe("#searchUrl", () => {
    const config = new Search("google", {
      google: "https://google.com/search?q={}",
      yahoo: "https://yahoo.com/search?q={}",
    });

    it.each([
      ["http://google.com", "http://google.com/"],
      ["google.com", "http://google.com"],
      ["google apple", "https://google.com/search?q=apple"],
      ["yahoo apple", "https://yahoo.com/search?q=apple"],
      ["google apple banana", "https://google.com/search?q=apple%20banana"],
      ["yahoo C++CLI", "https://yahoo.com/search?q=C%2B%2BCLI"],
      ["localhost", "http://localhost"],
      ["http://localhost", "http://localhost/"],
      ["localhost:8080", "http://localhost:8080"],
      ["localhost:80nan", "https://google.com/search?q=localhost%3A80nan"],
      ["localhost 8080", "https://google.com/search?q=localhost%208080"],
      ["localhost:80/build", "http://localhost:80/build"],
      ["http://127.0.0.1", "http://127.0.0.1/"],
      ["http://127.0.0.1:8080", "http://127.0.0.1:8080/"],
      ["http://[::1]", "http://[::1]/"],
      ["http://[::1]:8080", "http://[::1]:8080/"],
    ])("converts URL '%s'", (src, expected) => {
      expect(parsers.searchUrl(src, config)).toEqual(expected);
    });

    it("user default search engine", () => {
      expect(parsers.searchUrl("apple banana", config)).toEqual(
        "https://google.com/search?q=apple%20banana"
      );
    });

    it("searches with a word containing a colon", () => {
      expect(parsers.searchUrl("foo:", config)).toEqual(
        "https://google.com/search?q=foo%3A"
      );
      expect(parsers.searchUrl("std::vector", config)).toEqual(
        "https://google.com/search?q=std%3A%3Avector"
      );
    });
  });

  describe("#normalizeUrl", () => {
    it("normalize urls", () => {
      expect(parsers.normalizeUrl("https://google.com/")).toEqual(
        "https://google.com/"
      );
      expect(parsers.normalizeUrl("google.com")).toEqual("http://google.com");
    });
  });
});
