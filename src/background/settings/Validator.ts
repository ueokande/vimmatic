import { injectable, inject } from "inversify";
import Settings from "../../shared/Settings";
import PropertyRegistry from "../property/PropertyRegistry";

@injectable()
export default class Validator {
  constructor(
    @inject("PropertyRegistry")
    private readonly propertyRegistry: PropertyRegistry
  ) {}

  validate(settings: Settings) {
    const properties = settings.properties || {};
    Object.entries(properties).forEach(([name, value]) => {
      const prop = this.propertyRegistry.getProperty(name);
      if (typeof prop === "undefined") {
        throw new Error(`Unknown property: ${name}`);
      }
      try {
        prop.validate(value);
      } catch (e) {
        throw new TypeError(`Invalid ${name} property: ${e.message}`);
      }
    });
  }
}
