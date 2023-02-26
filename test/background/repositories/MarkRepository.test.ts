import { MarkRepositoryImpl } from "../../../src/background/repositories/MarkRepository";

describe("MarkRepositoryImpl", () => {
  const sut = new MarkRepositoryImpl();

  describe("global mark", () => {
    it("get and set global marks", () => {
      sut.setGlobalMark("A", {
        x: 10,
        y: 20,
        tabId: 1,
        url: "http://example.com/",
      });
      expect(sut.getGlobalMark("A")).toEqual({
        x: 10,
        y: 20,
        tabId: 1,
        url: "http://example.com/",
      });

      expect(sut.getGlobalMark("Z")).toBeUndefined();
    });
  });

  describe("local mark", () => {
    it("get and set local marks", () => {
      sut.setLocalMark(1, "a", { x: 10, y: 20 });
      expect(sut.getLocalMark(1, "a")).toEqual({
        x: 10,
        y: 20,
      });

      expect(sut.getLocalMark(1, "b")).toBeUndefined();
      expect(sut.getLocalMark(2, "a")).toBeUndefined();
    });
  });
});
