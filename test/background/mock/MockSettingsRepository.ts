import type { SettingsRepository } from "../../../src/background/settings/SettingsRepository";
import type { Settings } from "../../../src/shared/settings";

export class MockSettingsRepository implements SettingsRepository {
  load(): Promise<Settings> {
    throw new Error("not implemented");
  }

  save(): Promise<void> {
    throw new Error("not implemented");
  }

  onChanged(): void {
    throw new Error("not implemented");
  }
}
