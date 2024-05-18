import MarkHelper from "../../../src/background/usecases/MarkHelper";
import { describe, it, expect } from "vitest";

describe("MarkHelper", () => {
  const sut = new MarkHelper();
  describe("isGlobalKey", () => {
    it("return true if the key is a global key", () => {
      expect(sut.isGlobalKey("a")).toBeFalsy();
      expect(sut.isGlobalKey("b")).toBeFalsy();
      expect(sut.isGlobalKey("A")).toBeTruthy();
      expect(sut.isGlobalKey("0")).toBeTruthy();
    });
  });
});
