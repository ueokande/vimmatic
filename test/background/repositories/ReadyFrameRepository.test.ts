import { ReadyFrameRepositoryImpl } from "../../../src/background/repositories/ReadyFrameRepository";

describe("background/repositories/ReadyFrameRepositoryImpl", () => {
  let sut: ReadyFrameRepositoryImpl;

  beforeEach(() => {
    sut = new ReadyFrameRepositoryImpl();
  });

  it("get and set a keyword", () => {
    expect(sut.getFrameIds(1)).toBeUndefined;

    sut.addFrameId(1, 10);
    sut.addFrameId(1, 12);
    sut.addFrameId(1, 11);
    sut.addFrameId(2, 20);
    sut.addFrameId(2, 21);
    sut.addFrameId(2, 21);

    expect(sut.getFrameIds(1)).toEqual([10, 11, 12]);
    expect(sut.getFrameIds(2)).toEqual([20, 21]);

    sut.removeFrameId(2, 21);
    expect(sut.getFrameIds(2)).toEqual([20, 21]);

    sut.removeFrameId(2, 21);
    expect(sut.getFrameIds(2)).toEqual([20]);

    sut.removeFrameId(2, 20);
    expect(sut.getFrameIds(2)).toBeUndefined;
  });
});
