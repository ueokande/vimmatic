import { ReadyFrameRepositoryImpl } from "../../../src/background/repositories/ReadyFrameRepository";
import { MockLocalStorage } from "../mock/MockLocalStorage";
import { describe, it, expect } from "vitest";

describe("ReadyFrameRepositoryImpl", () => {
  const sut = new ReadyFrameRepositoryImpl(new MockLocalStorage({}));

  it("get and set a keyword", async () => {
    expect(await sut.getFrameIds(1)).toBeUndefined;

    await sut.addFrameId(1, 10);
    await sut.addFrameId(1, 12);
    await sut.addFrameId(1, 11);
    await sut.addFrameId(2, 20);
    await sut.addFrameId(2, 21);
    await sut.addFrameId(2, 21);

    expect(await sut.getFrameIds(1)).toEqual([10, 11, 12]);
    expect(await sut.getFrameIds(2)).toEqual([20, 21]);

    await sut.removeFrameId(2, 21);
    expect(await sut.getFrameIds(2)).toEqual([20]);

    await sut.removeFrameId(2, 20);
    expect(await sut.getFrameIds(2)).toBeUndefined;
  });

  it("flush on tom frame ID", async () => {
    expect(await sut.getFrameIds(1)).toBeUndefined;

    await sut.addFrameId(1, 0);
    await sut.addFrameId(1, 10);
    await sut.addFrameId(1, 12);
    await sut.addFrameId(1, 11);
    await sut.addFrameId(2, 0);
    await sut.addFrameId(2, 20);
    await sut.addFrameId(2, 21);
    await sut.addFrameId(2, 21);

    await sut.addFrameId(1, 0);
    expect(await sut.getFrameIds(1)).toEqual([0]);

    await sut.removeFrameId(2, 0);
    expect(await sut.getFrameIds(2)).toBeUndefined;

    await sut.removeFrameId(2, 20);
    expect(await sut.getFrameIds(2)).toBeUndefined;
  });
});
