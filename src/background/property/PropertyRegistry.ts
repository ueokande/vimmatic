import Property from "./Property";

export default interface PropertyRegistry {
  register(prop: Property): void;

  getProperty(name: string): Property | undefined;

  getProperties(): Property[];
}

export class PropertyRegistryImpl {
  private readonly properties: Property[] = [];

  private readonly propertyNames: Map<string, Property> = new Map();

  register(prop: Property): void {
    if (prop.type() !== typeof prop.defaultValue()) {
      throw new Error(
        `Property ${prop.name()} is a ${prop.type()} value, but the default value is a ${typeof prop.defaultValue()}`
      );
    }

    if (this.propertyNames.has(prop.name())) {
      throw new Error(`Property ${prop.name()} is already registered`);
    }

    this.properties.push(prop);
    this.propertyNames.set(prop.name(), prop);
  }

  getProperty(name: string): Property | undefined {
    return this.propertyNames.get(name);
  }

  getProperties(): Property[] {
    return this.properties;
  }
}
