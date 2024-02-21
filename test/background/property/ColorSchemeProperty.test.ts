import ColorSchemeProperty from "../../../src/background/property/ColorSchemeProperty";

describe("ColorSchemeProperty", () => {
  describe("validate", () => {
    const valids = ["system", "light", "dark"];
    test.each(valids)('it should not throw an error for "%s"', (value) => {
      const prop = new ColorSchemeProperty();
      expect(() => prop.validate(value)).not.toThrow();
    });

    const invalids = ["red", 10];
    test.each(invalids)('it should throw an error for "%s"', (value) => {
      const prop = new ColorSchemeProperty();
      expect(() => prop.validate(value)).toThrow();
    });
  });
});
