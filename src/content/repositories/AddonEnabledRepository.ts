import { injectable } from "inversify";

let enabled = false;

export default interface AddonEnabledRepository {
  enable(): void;
  disable(): void;
  isEnabled(): boolean;
}

@injectable()
export class AddonEnabledRepositoryImpl implements AddonEnabledRepository {
  set(on: boolean): void {
    enabled = on;
  }

  get(): boolean {
    return enabled;
  }

  enable() {
    enabled = true;
  }

  disable() {
    enabled = false;
  }

  isEnabled() {
    return enabled;
  }
}
