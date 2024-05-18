import { AddonEnabledRepositoryImpl } from "../../../src/content/repositories/AddonEnabledRepository";
import { describe, it, expect } from "vitest";

describe("AddonEnabledRepositoryImpl", () => {
  it("updates and gets current value", () => {
    const sut = new AddonEnabledRepositoryImpl();

    sut.set(true);
    expect(sut.get()).toBeTruthy;

    sut.set(false);
    expect(sut.get()).toBeFalsy;
  });
});
