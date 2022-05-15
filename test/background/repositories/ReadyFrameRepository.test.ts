import { ReadyFrameRepositoryImpl } from "../../../src/background/repositories/ReadyFrameRepository";

describe("background/repositories/ReadyFrameRepositoryImpl", () => {
  let sut: ReadyFrameRepositoryImpl;

  beforeEach(() => {
    sut = new ReadyFrameRepositoryImpl();
  });

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
    expect(await sut.getFrameIds(2)).toEqual([20, 21]);

    await sut.removeFrameId(2, 21);
    expect(await sut.getFrameIds(2)).toEqual([20]);

    await sut.removeFrameId(2, 20);
    expect(await sut.getFrameIds(2)).toBeUndefined;
  });
});
