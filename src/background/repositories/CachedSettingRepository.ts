import { injectable, inject } from "inversify";
import MemoryStorage from "../infrastructures/MemoryStorage";
import Settings from "../../shared/settings/Settings";
import PropertyRegistry from "../property/PropertyRegistry";

const CACHED_SETTING_KEY = "setting";

export default interface CachedSettingRepository {
  get(): Promise<Settings>;

  update(value: Settings): Promise<void>;

  setProperty(name: string, value: string | number | boolean): Promise<void>;
}

@injectable()
export class CachedSettingRepositoryImpl implements CachedSettingRepository {
  private readonly cache = new MemoryStorage();

  constructor(
    @inject("PropertyRegistry")
    private readonly propertyRegistry: PropertyRegistry
  ) {}

  get(): Promise<Settings> {
    const data = this.cache.get(CACHED_SETTING_KEY);
    return Promise.resolve(Settings.fromJSON(data));
  }

  update(value: Settings): Promise<void> {
    this.cache.set(CACHED_SETTING_KEY, value.toJSON());
    return Promise.resolve();
  }

  async setProperty(
    name: string,
    value: string | number | boolean
  ): Promise<void> {
    const prop = this.propertyRegistry.getProperty(name);
    if (!prop) {
      throw new Error("unknown property: " + name);
    }
    if (typeof value !== prop.type()) {
      throw new TypeError(`property type of ${name} mismatch: ${typeof value}`);
    }
    if (prop.validate) {
      prop.validate(value);
    }

    const current = await this.get();
    current.properties[name] = value;
    if (typeof value === "string" && value === "") {
      current.properties[name] = prop.defaultValue();
    }
    await this.update(current);
  }
}
