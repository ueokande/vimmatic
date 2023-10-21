import type Property from "../../../src/background/property/Property";
import { PropertyRegistryImpl } from "../../../src/background/property/PropertyRegistry";

describe("CommandRegistryImpl", () => {
  test("register and get properties", () => {
    const props: Property[] = [
      {
        name: () => "prop1",
        description: () => "my prop 1",
        type: () => "string",
        defaultValue: () => "default",
        validate: () => true,
      },
      {
        name: () => "prop2",
        description: () => "my prop 2",
        type: () => "number",
        defaultValue: () => 10,
        validate: () => true,
      },
      {
        name: () => "prop3",
        description: () => "my prop 3",
        type: () => "boolean",
        defaultValue: () => true,
        validate: () => true,
      },
    ];

    const r = new PropertyRegistryImpl();
    props.forEach((prop) => {
      r.register(prop);
    });

    const p1 = r.getProperty("prop1");
    expect(p1.name()).toBe("prop1");
    expect(p1.type()).toBe("string");
    expect(p1.defaultValue()).toBe("default");

    const p2 = r.getProperty("prop2");
    expect(p2.name()).toBe("prop2");
    expect(p2.type()).toBe("number");
    expect(p2.defaultValue()).toBe(10);

    const p3 = r.getProperty("prop3");
    expect(p3.name()).toBe("prop3");
    expect(p3.type()).toBe("boolean");
    expect(p3.defaultValue()).toBe(true);

    expect(r.getProperties()).toHaveLength(3);
  });

  test("throws an error on duplicated names", () => {
    const p1: Property = {
      name: () => "myprop",
      description: () => "my first property",
      type: () => "string",
      defaultValue: () => "default",
      validate: () => true,
    };
    const p2: Property = {
      name: () => "myprop",
      description: () => "my second property",
      type: () => "number",
      defaultValue: () => 100,
      validate: () => true,
    };
    const r = new PropertyRegistryImpl();
    r.register(p1);

    expect(() => r.register(p2)).toThrowError(
      "Property myprop is already registered",
    );
  });

  test("throws an error on duplicated names", () => {
    const r = new PropertyRegistryImpl();

    const p1: Property = {
      name: () => "prop",
      description: () => "my prop",
      type: () => "string",
      defaultValue: () => 100,
      validate: () => true,
    };
    expect(() => r.register(p1)).toThrowError(
      "Property prop is a string value, but the default value is a number",
    );

    const p2: Property = {
      name: () => "prop",
      description: () => "my prop",
      type: () => "boolean",
      defaultValue: () => "false",
      validate: () => true,
    };
    expect(() => r.register(p2)).toThrowError(
      "Property prop is a boolean value, but the default value is a string",
    );
  });
});
