import { AddonEnabledRepositoryImpl } from "../../../src/background/repositories/AddonEnabledRepository";

describe("AddonEnabledRepositoryImpl", () => {
  it("set and reset addon enabled", () => {
    const listener = jest.fn();
    const sut = new AddonEnabledRepositoryImpl();
    sut.onChange(listener);

    sut.enable(); // not notified
    expect(sut.isEnabled()).toBeTruthy();

    sut.disable(); // true => false
    expect(sut.isEnabled()).toBeFalsy();

    const ret1 = sut.toggle(); // false => true
    expect(sut.isEnabled()).toBeTruthy();
    expect(ret1).toBeTruthy();

    const ret2 = sut.toggle(); // true => fales
    expect(sut.isEnabled()).toBeFalsy();
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
