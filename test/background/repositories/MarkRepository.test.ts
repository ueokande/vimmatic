import { MarkRepositoryImpl } from "../../../src/background/repositories/MarkRepository";
import MockLocalStorage from "../mock/MockLocalStorage";
import { describe, it, expect } from "vitest";

describe("MarkRepositoryImpl", () => {
  const sut = new MarkRepositoryImpl(
    new MockLocalStorage({ globals: {}, locals: {} }),
  );

  describe("global mark", () => {
    it("get and set global marks", async () => {
      await sut.setGlobalMark("A", {
        x: 10,
        y: 20,
        tabId: 1,
        url: "http://example.com/",
      });
      expect(await sut.getGlobalMark("A")).toEqual({
        x: 10,
        y: 20,
        tabId: 1,
        url: "http://example.com/",
      });

      expect(await sut.getGlobalMark("Z")).toBeUndefined();
    });
  });

  describe("local mark", () => {
    it("get and set local marks", async () => {
      await sut.setLocalMark(1, "a", { x: 10, y: 20 });
      expect(await sut.getLocalMark(1, "a")).toEqual({
        x: 10,
        y: 20,
      });

      expect(await sut.getLocalMark(1, "b")).toBeUndefined();
      expect(await sut.getLocalMark(2, "a")).toBeUndefined();
    });
  });
});
