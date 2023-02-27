import AddonEnabledRepository from "../../../src/content/repositories/AddonEnabledRepository";

export default class MockAddonEnabledRepository
  implements AddonEnabledRepository
{
  constructor(public enabled: boolean) {}

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
