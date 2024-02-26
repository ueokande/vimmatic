import { injectable, inject } from "inversify";
import type { Settings } from "../../shared/settings";
import type { PropertyRegistry } from "../property/PropertyRegistry";
import type { OperatorRegistory } from "../operators/OperatorRegistory";

@injectable()
export default class Validator {
  constructor(
    @inject("PropertyRegistry")
    private readonly propertyRegistry: PropertyRegistry,
    @inject("OperatorRegistory")
    private readonly operatorRegistory: OperatorRegistory,
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

    const keymapEntries = settings.keymaps?.entries() || [];
    keymapEntries.forEach(([key, { type, props }]) => {
      const op = this.operatorRegistory.getOperator(type);
      if (typeof op === "undefined") {
        throw new Error("Unknown keymap: " + type);
      }
      const validator = op.schema();
      if (typeof validator === "undefined") {
        return;
      }
      const result = validator.safeParse(props);
      if (!result.success) {
        const [issue] = result.error.issues;
        const path = issue.path.join(".");
        const message = `Invalid property '${path}' on keymap '${key}': ${issue.message}`;
        throw new TypeError(message);
      }
    });
  }
}
