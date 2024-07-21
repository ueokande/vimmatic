import { provide } from "inversify-binding-decorators";
import { Mode } from "../../shared/mode";

let mode: Mode = Mode.Normal;

export interface ModeRepository {
  getMode(): Mode;

  setMode(mode: Mode): void;
}

export const ModeRepository = Symbol("ModeRepository");

@provide(ModeRepository)
export class ModeRepositoryImpl implements ModeRepository {
  getMode(): Mode {
    return mode;
  }

  setMode(newMode: Mode): void {
    mode = newMode;
  }
}
