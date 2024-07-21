import { injectable } from "inversify";
import { type LocalCache, LocalCacheImpl } from "../db/LocalStorage";

export interface AddonEnabledRepository {
  enable(): Promise<void>;

  disable(): Promise<void>;

  toggle(): Promise<boolean>;

  isEnabled(): Promise<boolean>;

  onChange(listener: OnChangeListener): void;
}

type OnChangeListener = (values: {
  oldValue: boolean;
  newValue: boolean;
}) => void;
const listeners: OnChangeListener[] = [];

export const AddonEnabledRepository = Symbol("AddonEnabledRepository");

@injectable()
export class AddonEnabledRepositoryImpl implements AddonEnabledRepository {
  constructor(
    private readonly cache: LocalCache<boolean> = new LocalCacheImpl<boolean>(
      AddonEnabledRepositoryImpl.name,
      true,
    ),
  ) {}

  async enable(): Promise<void> {
    const current = await this.cache.getValue();
    await this.cache.setValue(true);
    this.afterUpdate(current, true);
  }

  async disable(): Promise<void> {
    const current = await this.cache.getValue();
    await this.cache.setValue(false);
    this.afterUpdate(current, false);
  }

  async toggle(): Promise<boolean> {
    const current = await this.cache.getValue();
    await this.cache.setValue(!current);
    this.afterUpdate(current, !current);
    return !current;
  }

  isEnabled(): Promise<boolean> {
    return this.cache.getValue();
  }

  onChange(listener: OnChangeListener): void {
    listeners.push(listener);
  }

  private afterUpdate(oldValue: boolean, newValue: boolean) {
    if (oldValue === newValue) {
      return;
    }
    listeners.forEach((f) => f({ oldValue, newValue }));
  }
}
