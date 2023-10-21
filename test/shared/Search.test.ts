import Search from "../../src/shared/Search";

describe("Search", () => {
  it("create a search engines", () => {
    const search = new Search("google", {
      google: "https://google.com/search?q={}",
      yahoo: "https://search.yahoo.com/search?p={}",
    });

    expect(search.defaultEngine).toBe("google");
    expect(search.engines).toMatchObject({
      google: "https://google.com/search?q={}",
      yahoo: "https://search.yahoo.com/search?p={}",
    });
  });

  test("it throws an error on invalid search engine settings", () => {
    expect(
      () =>
        new Search("wikipedia", {
          google: "https://google.com/search?q={}",
          yahoo: "https://search.yahoo.com/search?p={}",
        }),
    ).toThrow(TypeError);
    expect(
      () =>
        new Search("g o o g l e", {
          "g o o g l e": "https://google.com/search?q={}",
        }),
    ).toThrow(TypeError);
    expect(
      () =>
        new Search("google", {
          google: "https://google.com/search",
        }),
    ).toThrow(TypeError);
    expect(
      () =>
        new Search("google", {
          google: "https://google.com/search?q={}&r={}",
        }),
    ).toThrow(TypeError);
  });
});
