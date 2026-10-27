import type { AddonEnabledClient } from "../../../src/content/client/AddonEnabledClient";

export class MockAddonEnabledClient implements AddonEnabledClient {
  constructor(public enabled = true) {}

  async isEnabled(): Promise<boolean> {
    return this.enabled;
  }
}
