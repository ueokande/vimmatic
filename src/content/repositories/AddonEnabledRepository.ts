import { provide } from "inversify-binding-decorators";

let enabled = false;

export interface AddonEnabledRepository {
  enable(): void;
  disable(): void;
  isEnabled(): boolean;
}

export const AddonEnabledRepository = Symbol("AddonEnabledRepository");

@provide(AddonEnabledRepository)
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
