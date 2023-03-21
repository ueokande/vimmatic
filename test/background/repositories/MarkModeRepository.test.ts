import { MarkModeRepositoryImpl } from "../../../src/background/repositories/MarkModeRepository";
import MockLocalStorage from "../mock/MockLocalStorage";

describe("MarkModeRepositoryImpl", () => {
  const sut = new MarkModeRepositoryImpl(new MockLocalStorage(null));

  it("transits state", async () => {
    expect(await sut.isSetMode()).toBeFalsy();
    expect(await sut.isJumpMode()).toBeFalsy();

    await sut.enableSetMode();
    expect(await sut.isSetMode()).toBeTruthy();

    await sut.enableJumpMode();
    expect(await sut.isJumpMode()).toBeTruthy();

    await sut.clearMode();
    expect(await sut.isSetMode()).toBeFalsy();
    expect(await sut.isJumpMode()).toBeFalsy();
  });
});
