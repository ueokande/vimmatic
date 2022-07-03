import { injectable } from "inversify";

let enabled = false;

export default interface AddonEnabledRepository {
  set(on: boolean): void;

  get(): boolean;
}

@injectable()
export class AddonEnabledRepositoryImpl implements AddonEnabledRepository {
  set(on: boolean): void {
    enabled = on;
  }

  get(): boolean {
    return enabled;
  }
}
