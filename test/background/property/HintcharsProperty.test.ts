import { HintcharsProperty } from "../../../src/background/property/HintcharsProperty";
import { describe, test, expect } from "vitest";

describe("HintcharsProperty", () => {
  describe("validate", () => {
    const valids = ["abcdefg", "ab"];
    test.each(valids)('it should not throw an error for "%s"', (value) => {
      const prop = new HintcharsProperty();
      expect(() => prop.validate(value)).not.toThrow();
    });

    const invalids = ["a", "", 10];
    test.each(invalids)('it should throw an error for "%s"', (value) => {
      const prop = new HintcharsProperty();
      expect(() => prop.validate(value)).toThrow();
    });
  });
});
