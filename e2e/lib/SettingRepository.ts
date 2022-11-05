import { SerializedSettings } from "../../src/settings/schema";

export default class SettingRepository {
  constructor(private readonly api: typeof browser) {}

  async save(serialized: SerializedSettings): Promise<void> {
    return this.api.storage.sync.set({ settings: serialized });
  }
}
