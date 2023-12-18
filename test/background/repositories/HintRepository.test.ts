import { HintRepositoryImpl } from "../../../src/background/repositories/HintRepository";
import MockLocalStorage from "../mock/MockLocalStorage";

describe("HintRepositoryImpl", () => {
  it("enable and disable followings", async () => {
    const sut = new HintRepositoryImpl(
      new MockLocalStorage({
        enabled: false,
        option: { newTab: false, background: false },
        hints: [],
        keys: [],
      }),
    );

    expect(await sut.isEnabled()).toBeFalsy();

    await sut.startHintMode({ newTab: true, background: false }, [
      "a",
      "b",
      "c",
    ]);

    expect(await sut.isEnabled()).toBeTruthy();
    expect(await sut.getOption()).toEqual({ newTab: true, background: false });

    await sut.stopHintMode();
    expect(await sut.isEnabled()).toBeFalsy();
  });

  it("push and pop keys", async () => {
    const sut = new HintRepositoryImpl(
      new MockLocalStorage({
        enabled: false,
        option: { newTab: false, background: false },
        hints: [],
        keys: [],
      }),
    );
    const hints = ["a", "b", "c", "aa", "ab", "ac", "ba", "bb", "bc"];

    await sut.startHintMode({ newTab: true, background: false }, hints);
    expect(await sut.getKeys()).toEqual("");
    expect(await sut.getMatchedHints()).toEqual(hints);

    await sut.pushKey("a");
    expect(await sut.getKeys()).toEqual("a");
    expect(await sut.getMatchedHints()).toEqual(["a", "aa", "ab", "ac"]);

    await sut.popKey();
    expect(await sut.getKeys()).toEqual("");
    expect(await sut.getMatchedHints()).toEqual(hints);

    await sut.pushKey("b");
    expect(await sut.getKeys()).toEqual("b");
    expect(await sut.getMatchedHints()).toEqual(["b", "ba", "bb", "bc"]);

    await sut.pushKey("b");
    expect(await sut.getKeys()).toEqual("bb");
    expect(await sut.getMatchedHints()).toEqual(["bb"]);
  });
});
