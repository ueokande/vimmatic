import { MarkModeRepositoryImpl } from "../../../src/background/repositories/MarkModeRepository";

describe("MarkModeRepositoryImpl", () => {
  const sut = new MarkModeRepositoryImpl();

  it("transits state", () => {
    expect(sut.isSetMode()).toBeFalsy();
    expect(sut.isJumpMode()).toBeFalsy();

    sut.enableSetMode();
    expect(sut.isSetMode()).toBeTruthy();

    sut.enableJumpMode();
    expect(sut.isJumpMode()).toBeTruthy();

    sut.clearMode();
    expect(sut.isSetMode()).toBeFalsy();
    expect(sut.isJumpMode()).toBeFalsy();
  });
});
