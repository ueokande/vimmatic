import { injectable } from "inversify";
import MemoryStorage from "../db/MemoryStorage";

export default interface AddonEnabledRepository {
  enable(): void;

  disable(): void;

  toggle(): boolean;

  isEnabled(): boolean;

  onChange(listener: OnChangeListener): void;
}

type OnChangeListener = (values: {
  oldValue: boolean;
  newValue: boolean;
}) => void;
const listeners: OnChangeListener[] = [];

@injectable()
export class AddonEnabledRepositoryImpl implements AddonEnabledRepository {
  private readonly cache = new MemoryStorage<boolean>(
    AddonEnabledRepositoryImpl.name,
    true
  );

  enable(): void {
    const current = this.cache.get();
    this.cache.set(true);
    this.afterUpdate(current, true);
  }

  disable(): void {
    const current = this.cache.get();
    this.cache.set(false);
    this.afterUpdate(current, false);
  }

  toggle(): boolean {
    const current = this.cache.get();
    this.cache.set(!current);
    this.afterUpdate(current, !current);
    return !current;
  }

  isEnabled(): boolean {
    return this.cache.get();
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
