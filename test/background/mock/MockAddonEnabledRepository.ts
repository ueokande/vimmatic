import type { AddonEnabledRepository } from "../../../src/background/repositories/AddonEnabledRepository";

export class MockAddonEnabledRepository implements AddonEnabledRepository {
  enable(): Promise<void> {
    throw new Error("not implemented");
  }

  disable(): Promise<void> {
    throw new Error("not implemented");
  }

  toggle(): Promise<boolean> {
    throw new Error("not implemented");
  }

  isEnabled(): Promise<boolean> {
    throw new Error("not implemented");
  }

  onChange(_listener: unknown): Promise<void> {
    throw new Error("not implemented");
  }
}
