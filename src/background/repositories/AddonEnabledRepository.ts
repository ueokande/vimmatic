import { injectable } from "inversify";
import MemoryStorage from "../infrastructures/MemoryStorage";

export default interface AddonEnabledRepository {
  enable(): void;

  disable(): void;

  toggle(): boolean;

  isEnabled(): boolean;
}

@injectable()
export class AddonEnabledRepositoryImpl implements AddonEnabledRepository {
  private readonly cache = new MemoryStorage<boolean>(
    AddonEnabledRepositoryImpl.name,
    true
  );

  enable(): void {
    this.cache.set(true);
  }

  disable(): void {
    this.cache.set(false);
  }

  toggle(): boolean {
    const current = this.cache.get();
    this.cache.set(!current);
    return !current;
  }

  isEnabled(): boolean {
    return this.cache.get();
  }
}
