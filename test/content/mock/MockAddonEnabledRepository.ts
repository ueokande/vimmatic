import type { AddonEnabledRepository } from "../../../src/content/repositories/AddonEnabledRepository";

export class MockAddonEnabledRepository implements AddonEnabledRepository {
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
