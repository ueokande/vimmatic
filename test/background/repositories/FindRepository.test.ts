import { FindRepositoryImpl } from "../../../src/background/repositories/FindRepository";
import { MockLocalStorage } from "../mock/MockLocalStorage";
import { describe, beforeEach, it, expect } from "vitest";

describe("background/repositories/FindRepositoryImpl", () => {
  let sut: FindRepositoryImpl;

  beforeEach(() => {
    sut = new FindRepositoryImpl(new MockLocalStorage({ local: {} }));
  });

  describe("global keyword", () => {
    it("get and set a keyword", async () => {
      expect(await sut.getGlobalKeyword()).toBeUndefined;

      await sut.setGlobalKeyword("Hello, world");

      const keyword = await sut.getGlobalKeyword();
      expect(keyword).toEqual("Hello, world");
    });
  });

  describe("local state", () => {
    it("get and set a keyword", async () => {
      expect(await sut.getLocalState(10)).toBeUndefined;

      await sut.setLocalState(10, {
        keyword: "Hello, world",
        frameId: 11,
      });

      const state = await sut.getLocalState(10);
      expect(state?.keyword).toEqual("Hello, world");
      expect(state?.frameId).toEqual(11);

      expect(await sut.getLocalState(20)).toBeUndefined;
    });
  });
});
