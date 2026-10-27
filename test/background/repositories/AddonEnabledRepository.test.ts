import { describe, expect, it } from "vitest";
import { AddonEnabledRepositoryImpl } from "../../../src/background/repositories/AddonEnabledRepository";
import { MockLocalStorage } from "../mock/MockLocalStorage";

describe("AddonEnabledRepositoryImpl", () => {
  it("is enabled by default", async () => {
    const sut = new AddonEnabledRepositoryImpl(new MockLocalStorage({}));

    expect(await sut.isEnabled(1)).toBeTruthy();
  });

  it("stores enabled state per tab", async () => {
    const sut = new AddonEnabledRepositoryImpl(new MockLocalStorage({}));

    await sut.setEnabled(1, false);
    expect(await sut.isEnabled(1)).toBeFalsy();
    expect(await sut.isEnabled(2)).toBeTruthy();

    await sut.setEnabled(1, true);
    expect(await sut.isEnabled(1)).toBeTruthy();
  });

  it("toggles enabled state of a tab", async () => {
    const sut = new AddonEnabledRepositoryImpl(new MockLocalStorage({}));

    expect(await sut.toggle(1)).toBeFalsy();
    expect(await sut.isEnabled(1)).toBeFalsy();
    expect(await sut.isEnabled(2)).toBeTruthy();

    expect(await sut.toggle(1)).toBeTruthy();
    expect(await sut.isEnabled(1)).toBeTruthy();
  });

  it("serializes concurrent toggles", async () => {
    const sut = new AddonEnabledRepositoryImpl(new MockLocalStorage({}));

    const results = await Promise.all([
      sut.toggle(1),
      sut.toggle(1),
      sut.toggle(1),
    ]);

    expect(results).toEqual([false, true, false]);
    expect(await sut.isEnabled(1)).toBeFalsy();
  });

  it("deletes state of a tab", async () => {
    const sut = new AddonEnabledRepositoryImpl(new MockLocalStorage({}));

    await sut.setEnabled(1, false);
    await sut.delete(1);

    expect(await sut.isEnabled(1)).toBeTruthy();
  });
});
