import { inject, injectable } from "inversify";
import CachedSettingRepository from "../repositories/CachedSettingRepository";
import SettingData, { DefaultSettingData } from "../../shared/SettingData";
import Settings from "../../shared/settings/Settings";
import Notifier from "../presenters/Notifier";
import SettingRepository from "../repositories/SettingRepository";
import PropertyRegistry from "../property/PropertyRegistry";

@injectable()
export default class SettingUseCase {
  constructor(
    @inject("LocalSettingRepository")
    private readonly localSettingRepository: SettingRepository,
    @inject("SyncSettingRepository")
    private readonly syncSettingRepository: SettingRepository,
    @inject("CachedSettingRepository")
    private readonly cachedSettingRepository: CachedSettingRepository,
    @inject("Notifier")
    private readonly notifier: Notifier,
    @inject("PropertyRegistry")
    private readonly propertyRegistry: PropertyRegistry
  ) {}

  getCached(): Promise<Settings> {
    return this.cachedSettingRepository.get();
  }

  async reload(): Promise<Settings> {
    let data = DefaultSettingData;
    try {
      data = await this.loadSettings();
    } catch (e) {
      this.showUnableToLoad(e);
    }

    let value: Settings;
    try {
      value = data.toSettings();
    } catch (e) {
      this.showUnableToLoad(e);
      value = DefaultSettingData.toSettings();
    }
    value = this.fillPropetyDefaultValues(value);
    await this.cachedSettingRepository.update(value!);
    return value;
  }

  private async loadSettings(): Promise<SettingData> {
    const sync = await this.syncSettingRepository.load();
    if (sync) {
      return sync;
    }
    const local = await this.localSettingRepository.load();
    if (local) {
      return local;
    }
    return DefaultSettingData;
  }

  private showUnableToLoad(e: Error) {
    console.error("unable to load settings", e);
    this.notifier.notifyInvalidSettings(e, () => {
      browser.runtime.openOptionsPage();
    });
  }

  private fillPropetyDefaultValues(settings: Settings) {
    if (typeof settings.properties === "undefined") {
      settings.properties = {};
    }

    const props = this.propertyRegistry.getProperties();
    props.forEach((prop) => {
      const currentValue = settings.properties[prop.name()];
      if (typeof currentValue === "undefined") {
        settings.properties[prop.name()] = prop.defaultValue();
        return;
      }
      try {
        prop.validate && prop.validate(currentValue);
      } catch (e) {
        console.warn(`Property ${prop.name()} has invalid value: ${e.message}`);
        settings.properties[prop.name()] = prop.defaultValue();
      }
    });
    return settings;
  }
}
