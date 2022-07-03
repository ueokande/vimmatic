import { injectable, inject } from "inversify";
import SettingUseCase from "../usecases/SettingUseCase";
import ContentMessageClient from "../infrastructures/ContentMessageClient";
import Settings from "../../shared/settings/Settings";

@injectable()
export default class SettingController {
  constructor(
    @inject(SettingUseCase)
    private readonly settingUseCase: SettingUseCase,
    @inject(ContentMessageClient)
    private readonly contentMessageClient: ContentMessageClient
  ) {}

  getSetting(): Promise<Settings> {
    return this.settingUseCase.getCached();
  }

  async reload(): Promise<void> {
    await this.settingUseCase.reload();
    this.contentMessageClient.broadcastSettingsChanged();
  }
}
