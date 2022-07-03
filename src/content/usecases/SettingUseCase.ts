import { injectable, inject } from "inversify";
import SettingRepository from "../repositories/SettingRepository";
import SettingClient from "../client/SettingClient";
import Settings from "../../shared/settings/Settings";

@injectable()
export default class SettingUseCase {
  constructor(
    @inject("SettingRepository")
    private readonly repository: SettingRepository,
    @inject("SettingClient")
    private readonly client: SettingClient
  ) {}

  async reload(): Promise<Settings> {
    const settings = await this.client.load();
    this.repository.set(settings);
    return settings;
  }
}
