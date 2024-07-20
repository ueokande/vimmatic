import { SmoothScrollProperty } from "../../../src/background/property/SmoothScrollProperty";
import { describe, test, expect } from "vitest";

describe("SmoothScrollProperty", () => {
  describe("validate", () => {
    const valids = [true, false];
    test.each(valids)('it should not throw an error for "%s"', (value) => {
      const prop = new SmoothScrollProperty();
      expect(() => prop.validate(value)).not.toThrow();
    });

    const invalids = ["true", 10];
    test.each(invalids)('it should throw an error for "%s"', (value) => {
      const prop = new SmoothScrollProperty();
      expect(() => prop.validate(value)).toThrow();
    });
  });
});
