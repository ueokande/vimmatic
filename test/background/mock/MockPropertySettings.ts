import type { PropertySettings } from "../../../src/background/settings/PropertySettings";

export class MockPropertySettings implements PropertySettings {
  setProperty(_name: string, _value: string | number | boolean): Promise<void> {
    throw new Error("not implemented");
  }

  getProperty(_name: string): Promise<string | number | boolean> {
    throw new Error("not implemented");
  }
}
