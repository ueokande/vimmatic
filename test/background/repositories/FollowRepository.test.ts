import { FollowRepositoryImpl } from "../../../src/background/repositories/FollowRepository";

describe("FollowRepositoryImpl", () => {
  it("enable and disable followings", () => {
    const sut = new FollowRepositoryImpl();

    expect(sut.isEnabled()).toBeFalsy();

    sut.startFollowMode({ newTab: true, background: false }, ["a", "b", "c"]);

    expect(sut.isEnabled()).toBeTruthy();
    expect(sut.getOption()).toEqual({ newTab: true, background: false });

    sut.stopFollowMode();
    expect(sut.isEnabled()).toBeFalsy();
  });

  it("push and pop keys", () => {
    const sut = new FollowRepositoryImpl();
    const hints = ["a", "b", "c", "aa", "ab", "ac", "ba", "bb", "bc"];

    sut.startFollowMode({ newTab: true, background: false }, hints);
    expect(sut.getKeys()).toEqual("");
    expect(sut.getMatchedHints()).toEqual(hints);

    sut.pushKey("a");
    expect(sut.getKeys()).toEqual("a");
    expect(sut.getMatchedHints()).toEqual(["a", "aa", "ab", "ac"]);

    sut.popKey();
    expect(sut.getKeys()).toEqual("");
    expect(sut.getMatchedHints()).toEqual(hints);

    sut.pushKey("b");
    expect(sut.getKeys()).toEqual("b");
    expect(sut.getMatchedHints()).toEqual(["b", "ba", "bb", "bc"]);

    sut.pushKey("b");
    expect(sut.getKeys()).toEqual("bb");
    expect(sut.getMatchedHints()).toEqual(["bb"]);
  });
});
