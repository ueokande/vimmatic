import { AddonEnabledRepositoryImpl } from "../../../src/background/repositories/AddonEnabledRepository";

describe("AddonEnabledRepositoryImpl", () => {
  it("set and reset addon enabled", () => {
    const sut = new AddonEnabledRepositoryImpl();

    sut.enable();
    expect(sut.isEnabled()).toBeTruthy();

    sut.disable();
    expect(sut.isEnabled()).toBeFalsy();

    sut.toggle();
    expect(sut.isEnabled()).toBeTruthy();

    sut.toggle();
    expect(sut.isEnabled()).toBeFalsy();
  });
});
