import { FollowRepositoryImpl } from "../../../src/background/repositories/FollowRepository";

describe("FollowRepositoryImpl", () => {
  it("enable and disable followings", async () => {
    const sut = new FollowRepositoryImpl();

    await expect(sut.isEnabled()).resolves.toBeFalsy();

    await sut.startFollowMode({ newTab: true, background: false }, [
      "a",
      "b",
      "c",
    ]);

    await expect(sut.isEnabled()).resolves.toBeTruthy();
    await expect(sut.getOption()).resolves.toEqual({
      newTab: true,
      background: false,
    });

    await sut.stopFollowMode();
    await expect(sut.isEnabled()).resolves.toBeFalsy();
  });

  it("push and pop keys", async () => {
    const sut = new FollowRepositoryImpl();
    const hints = ["a", "b", "c", "aa", "ab", "ac", "ba", "bb", "bc"];

    await sut.startFollowMode({ newTab: true, background: false }, hints);
    await expect(sut.getKeys()).resolves.toEqual("");
    await expect(sut.getMatchedHints()).resolves.toEqual(hints);

    await sut.pushKey("a");
    await expect(sut.getKeys()).resolves.toEqual("a");
    await expect(sut.getMatchedHints()).resolves.toEqual([
      "a",
      "aa",
      "ab",
      "ac",
    ]);

    await sut.popKey();
    await expect(sut.getKeys()).resolves.toEqual("");
    await expect(sut.getMatchedHints()).resolves.toEqual(hints);

    await sut.pushKey("b");
    await expect(sut.getKeys()).resolves.toEqual("b");
    await expect(sut.getMatchedHints()).resolves.toEqual([
      "b",
      "ba",
      "bb",
      "bc",
    ]);

    await sut.pushKey("b");
    await expect(sut.getKeys()).resolves.toEqual("bb");
    await expect(sut.getMatchedHints()).resolves.toEqual(["bb"]);
  });
});
