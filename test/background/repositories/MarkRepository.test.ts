import { MarkRepositoryImpl } from "../../../src/background/repositories/MarkRepository";

describe("MarkRepositoryImpl", () => {
  const sut = new MarkRepositoryImpl();

  describe("global mark", () => {
    it("get and set global marks", async () => {
      await sut.setGlobalMark("A", {
        x: 10,
        y: 20,
        tabId: 1,
        url: "http://example.com/",
      });
      expect(sut.getGlobalMark("A")).resolves.toEqual({
        x: 10,
        y: 20,
        tabId: 1,
        url: "http://example.com/",
      });

      await expect(sut.getGlobalMark("Z")).resolves.toBeUndefined();
    });
  });

  describe("local mark", () => {
    it("get and set local marks", async () => {
      await sut.setLocalMark(1, "a", { x: 10, y: 20 });
      expect(sut.getLocalMark(1, "a")).resolves.toEqual({
        x: 10,
        y: 20,
      });

      expect(sut.getLocalMark(1, "b")).resolves.toBeUndefined();
      expect(sut.getLocalMark(2, "a")).resolves.toBeUndefined();
    });
  });
});
