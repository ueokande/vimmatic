import { AddonEnabledRepositoryImpl } from "../../../src/background/repositories/AddonEnabledRepository";
import { MockLocalStorage } from "../mock/MockLocalStorage";
import { describe, it, vi, expect } from "vitest";

describe("AddonEnabledRepositoryImpl", () => {
  it("set and reset addon enabled", async () => {
    const listener = vi.fn();
    const sut = new AddonEnabledRepositoryImpl(new MockLocalStorage(true));
    sut.onChange(listener);

    await sut.enable(); // not notified
    expect(await sut.isEnabled()).toBeTruthy();

    await sut.disable(); // true => false
    expect(await sut.isEnabled()).toBeFalsy();

    const ret1 = await sut.toggle(); // false => true
    expect(await sut.isEnabled()).toBeTruthy();
    expect(ret1).toBeTruthy();

    const ret2 = await sut.toggle(); // true => fales
    expect(await sut.isEnabled()).toBeFalsy();
    expect(ret2).toBeFalsy();

    expect(listener).toHaveBeenNthCalledWith(1, {
      oldValue: true,
      newValue: false,
    });
    expect(listener).toHaveBeenNthCalledWith(2, {
      oldValue: false,
      newValue: true,
    });
    expect(listener).toHaveBeenNthCalledWith(3, {
      oldValue: true,
      newValue: false,
    });
  });
});
