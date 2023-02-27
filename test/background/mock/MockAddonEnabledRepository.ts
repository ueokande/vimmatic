import AddonEnabledRepository from "../../../src/background/repositories/AddonEnabledRepository";

export default class MockAddonEnabledRepository
  implements AddonEnabledRepository
{
  enable(): void {
    throw new Error("not implemented");
  }

  disable(): void {
    throw new Error("not implemented");
  }

  toggle(): boolean {
    throw new Error("not implemented");
  }

  isEnabled(): boolean {
    throw new Error("not implemented");
  }
}
