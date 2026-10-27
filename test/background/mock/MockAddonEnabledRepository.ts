import type { AddonEnabledRepository } from "../../../src/background/repositories/AddonEnabledRepository";

export class MockAddonEnabledRepository implements AddonEnabledRepository {
  private readonly state = new Map<number, boolean>();

  async isEnabled(tabId: number): Promise<boolean> {
    return this.state.get(tabId) ?? true;
  }

  async setEnabled(tabId: number, enabled: boolean): Promise<void> {
    this.state.set(tabId, enabled);
  }

  async toggle(tabId: number): Promise<boolean> {
    const enabled = !(await this.isEnabled(tabId));
    this.state.set(tabId, enabled);
    return enabled;
  }

  async delete(tabId: number): Promise<void> {
    this.state.delete(tabId);
  }
}
