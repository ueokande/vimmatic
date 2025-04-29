import { HintRepositoryImpl } from "../../../src/background/repositories/HintRepository";
import { MockLocalStorage } from "../mock/MockLocalStorage";
import { describe, it, expect } from "vitest";

describe("HintRepositoryImpl", () => {
  it("enable and disable followings", async () => {
    const sut = new HintRepositoryImpl(
      new MockLocalStorage({
        name: "",
        option: { newTab: false, background: false },
        frameIds: [],
        hintsByTag: {},
        keys: [],
      }),
    );

    const hints = [
      { frameId: 0, element: "0", tag: "a" },
      { frameId: 0, element: "1", tag: "b" },
      { frameId: 0, element: "2", tag: "c" },
    ];
    await sut.startHintMode(
      "hint.test",
      { newTab: true, background: false },
      hints,
    );

    expect(await sut.getHintModeName()).toEqual("hint.test");
    expect(await sut.getOption()).toEqual({ newTab: true, background: false });
  });

  it("get matched hints", async () => {
    const sut = new HintRepositoryImpl(
      new MockLocalStorage({
        name: "",
        option: { newTab: false, background: false },
        frameIds: [],
        hintsByTag: {},
        keys: [],
      }),
    );

    const hints = [
      { frameId: 0, element: "0", tag: "a" },
      { frameId: 0, element: "1", tag: "b" },
      { frameId: 1, element: "0", tag: "c" },
      { frameId: 1, element: "1", tag: "aa" },
      { frameId: 2, element: "0", tag: "ab" },
      { frameId: 2, element: "1", tag: "ac" },
    ];

    await sut.startHintMode(
      "hint.test",
      { newTab: true, background: false },
      hints,
    );

    expect(await sut.getMatchedHints(0)).toEqual([
      { frameId: 0, element: "0", tag: "a" },
      { frameId: 0, element: "1", tag: "b" },
    ]);
    expect(await sut.getMatchedHints(1)).toEqual([
      { frameId: 1, element: "0", tag: "c" },
      { frameId: 1, element: "1", tag: "aa" },
    ]);
    expect(await sut.getMatchedHints(2)).toEqual([
      { frameId: 2, element: "0", tag: "ab" },
      { frameId: 2, element: "1", tag: "ac" },
    ]);
  });

  it("push and pop keys", async () => {
    const sut = new HintRepositoryImpl(
      new MockLocalStorage({
        name: "",
        option: { newTab: false, background: false },
        frameIds: [],
        hintsByTag: {},
        keys: [],
      }),
    );
    const hints = [
      { frameId: 0, element: "0", tag: "a" },
      { frameId: 0, element: "1", tag: "b" },
      { frameId: 1, element: "0", tag: "c" },
      { frameId: 1, element: "1", tag: "aa" },
      { frameId: 2, element: "0", tag: "ab" },
      { frameId: 2, element: "1", tag: "ac" },
    ];

    await sut.startHintMode(
      "hint.test",
      { newTab: true, background: false },
      hints,
    );
    expect(await sut.getAllMatchedHints()).toEqual(hints);

    await sut.pushKey("a");
    expect(await sut.getAllMatchedHints()).toEqual([
      { frameId: 0, element: "0", tag: "a" },
      { frameId: 1, element: "1", tag: "aa" },
      { frameId: 2, element: "0", tag: "ab" },
      { frameId: 2, element: "1", tag: "ac" },
    ]);
    expect(await sut.getCurrentQueuedKeys()).toEqual("a");

    await sut.popKey();
    expect(await sut.getAllMatchedHints()).toEqual(hints);
    expect(await sut.getCurrentQueuedKeys()).toEqual("");

    await sut.pushKey("b");
    expect(await sut.getAllMatchedHints()).toEqual([
      { frameId: 0, element: "1", tag: "b" },
    ]);
    expect(await sut.getCurrentQueuedKeys()).toEqual("b");
  });
});
