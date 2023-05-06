import PropertyRegistry from "../../../src/background/property/PropertyRegistry";
import Property from "../../../src/background/property/Property";

class MockPropertyRegistry implements PropertyRegistry {
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

export default MockPropertyRegistry;
