import { MarkModeRepositoryImpl } from "../../../src/background/repositories/MarkModeRepository";

describe("MarkModeRepositoryImpl", () => {
  const sut = new MarkModeRepositoryImpl();

  it("transits state", async () => {
    await expect(sut.isSetMode()).resolves.toBeFalsy();
    await expect(sut.isJumpMode()).resolves.toBeFalsy();

    await sut.enableSetMode();
    await expect(sut.isSetMode()).resolves.toBeTruthy();

    await sut.enableJumpMode();
    await expect(sut.isJumpMode()).resolves.toBeTruthy();

    await sut.clearMode();
    await expect(sut.isSetMode()).resolves.toBeFalsy();
    await expect(sut.isJumpMode()).resolves.toBeFalsy();
  });
});
