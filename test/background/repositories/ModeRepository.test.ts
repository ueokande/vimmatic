import { describe, expect, it } from "vitest";
import { ModeRepositoryImpl } from "../../../src/background/repositories/ModeRepository";
import { Mode } from "../../../src/shared/mode";
import { MockLocalStorage } from "../mock/MockLocalStorage";

describe("ModeRepositoryImpl", () => {
  it("defaults to Normal for an unknown tab", async () => {
    const sut = new ModeRepositoryImpl(new MockLocalStorage({}));
    expect(await sut.getMode(1)).toEqual(Mode.Normal);
  });

  it("stores the mode per tab", async () => {
    const sut = new ModeRepositoryImpl(new MockLocalStorage({}));

    await sut.setMode(1, Mode.Insert);
    await sut.setMode(2, Mode.Follow);

    expect(await sut.getMode(1)).toEqual(Mode.Insert);
    expect(await sut.getMode(2)).toEqual(Mode.Follow);
    // An untouched tab is unaffected by other tabs' modes.
    expect(await sut.getMode(3)).toEqual(Mode.Normal);
  });

  it("drops the entry when reset to Normal", async () => {
    const sut = new ModeRepositoryImpl(new MockLocalStorage({}));

    await sut.setMode(1, Mode.Insert);
    expect(await sut.getMode(1)).toEqual(Mode.Insert);

    await sut.setMode(1, Mode.Normal);
    expect(await sut.getMode(1)).toEqual(Mode.Normal);
  });

  it("recovers from legacy string-valued storage without throwing", async () => {
    // Older versions stored a single Mode string under the same key.  Reading
    // that and treating it as the per-tab map used to throw on assignment.
    const legacy = "normal" as unknown as { [tabId: number]: Mode };
    const sut = new ModeRepositoryImpl(new MockLocalStorage(legacy));

    expect(await sut.getMode(1)).toEqual(Mode.Normal);
    await expect(sut.setMode(1, Mode.Follow)).resolves.toBeUndefined();
    expect(await sut.getMode(1)).toEqual(Mode.Follow);
  });
});
