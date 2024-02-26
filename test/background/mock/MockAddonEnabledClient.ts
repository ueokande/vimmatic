import type { AddonEnabledClient } from "../../../src/background/clients/AddonEnabledClient";

export default class MockAddonEnabledClient implements AddonEnabledClient {
  enable(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }

  disable(_tabId: number): Promise<void> {
    throw new Error("not implemented");
  }
}
