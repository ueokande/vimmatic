import type { PropertyRegistry } from "../../../src/background/property/PropertyRegistry";
import type { Property } from "../../../src/background/property/types";

export class MockPropertyRegistry implements PropertyRegistry {
  register(_prop: Property): void {
    throw new Error("not implemented");
  }

  getProperty(_name: string): Property | undefined {
    throw new Error("not implemented");
  }

  getProperties(): Property[] {
    throw new Error("not implemented");
  }
}
