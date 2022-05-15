import { injectable, inject } from "tsyringe";
import SettingRepository from "../repositories/SettingRepository";
import SettingClient from "../client/SettingClient";
import Settings from "../../shared/settings/Settings";

@injectable()
export default class SettingUseCase {
  constructor(
    @inject("SettingRepository") private repository: SettingRepository,
    @inject("SettingClient") private client: SettingClient
  ) {}

  async reload(): Promise<Settings> {
    const settings = await this.client.load();
    this.repository.set(settings);
    return settings;
  }
}
