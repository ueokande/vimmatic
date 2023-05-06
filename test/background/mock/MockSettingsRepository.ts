import SettingsRepository from "../../../src/background/settings/SettingsRepository";
import Settings from "../../../src/shared/Settings";

class MockSettingsRepository implements SettingsRepository {
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

export default MockSettingsRepository;
