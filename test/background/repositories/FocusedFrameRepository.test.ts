import { describe, expect, it } from "vitest";
import { FocusedFrameRepositoryImpl } from "../../../src/background/repositories/FocusedFrameRepository";
import { MockLocalStorage } from "../mock/MockLocalStorage";

describe("FocusedFrameRepositoryImpl", () => {
  it("reports whether any frame in the tab is focused", async () => {
    const sut = new FocusedFrameRepositoryImpl(new MockLocalStorage({}));

    expect(await sut.setFocused(1, 0, true)).toBe(true);
    // A child frame also gains focus; the tab is still focused.
    expect(await sut.setFocused(1, 10, true)).toBe(true);

    // The top frame blurs but the child frame still holds focus: the tab must
    // remain focused (this is the cross-frame case that used to be invisible).
    expect(await sut.setFocused(1, 0, false)).toBe(true);

    // The child frame blurs too: now nothing is focused.
    expect(await sut.setFocused(1, 10, false)).toBe(false);
  });

  it("tracks tabs independently", async () => {
    const sut = new FocusedFrameRepositoryImpl(new MockLocalStorage({}));

    expect(await sut.setFocused(1, 0, true)).toBe(true);
    // A different tab is unaffected.
    expect(await sut.setFocused(2, 0, true)).toBe(true);
    expect(await sut.setFocused(1, 0, false)).toBe(false);
    // Tab 2 still focused.
    expect(await sut.removeFrame(2, 0)).toBe(false);
  });

  it("clears all focus for a tab", async () => {
    const sut = new FocusedFrameRepositoryImpl(new MockLocalStorage({}));

    await sut.setFocused(1, 0, true);
    await sut.setFocused(1, 10, true);

    await sut.clearTab(1);

    // After clearing, a fresh focus report starts from empty.
    expect(await sut.setFocused(1, 0, false)).toBe(false);
  });

  it("is idempotent for repeated focus reports", async () => {
    const sut = new FocusedFrameRepositoryImpl(new MockLocalStorage({}));

    expect(await sut.setFocused(1, 5, true)).toBe(true);
    expect(await sut.setFocused(1, 5, true)).toBe(true);
    expect(await sut.setFocused(1, 5, false)).toBe(false);
  });
});
