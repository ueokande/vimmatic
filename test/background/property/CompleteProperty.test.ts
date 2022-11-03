import CompleteProperty from "../../../src/background/property/CompleteProperty";

describe("CompleteProperty", () => {
  describe("validate", () => {
    const valids = ["s", "b", "h", "sbh", "sss"];
    test.each(valids)('it should not throw an error for "%s"', (value) => {
      const prop = new CompleteProperty();
      expect(() => prop.validate(value)).not.toThrowError();
    });

    const invalids = ["xyz", 10];
    test.each(invalids)('it should throw an error for "%s"', (value) => {
      const prop = new CompleteProperty();
      expect(() => prop.validate(value)).toThrowError();
    });
  });
});
