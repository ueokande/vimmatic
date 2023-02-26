import { FindRepositoryImpl } from "../../../src/background/repositories/FindRepository";

describe("background/repositories/FindRepositoryImpl", () => {
  let sut: FindRepositoryImpl;

  beforeEach(() => {
    sut = new FindRepositoryImpl();
  });

  describe("global keyword", () => {
    it("get and set a keyword", () => {
      expect(sut.getGlobalKeyword()).toBeUndefined;

      sut.setGlobalKeyword("Hello, world");

      const keyword = sut.getGlobalKeyword();
      expect(keyword).toEqual("Hello, world");
    });
  });

  describe("local state", () => {
    it("get and set a keyword", () => {
      expect(sut.getLocalState(10)).toBeUndefined;

      sut.setLocalState(10, {
        keyword: "Hello, world",
        frameId: 11,
      });

      const state = sut.getLocalState(10);
      expect(state?.keyword).toEqual("Hello, world");
      expect(state?.frameId).toEqual(11);

      expect(sut.getLocalState(20)).toBeUndefined;
    });
  });
});
