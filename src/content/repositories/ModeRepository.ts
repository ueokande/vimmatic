import { injectable } from "inversify";
import { Mode } from "../../shared/mode";

let mode: Mode = Mode.Normal;

export interface ModeRepository {
  getMode(): Mode;

  setMode(mode: Mode): void;
}

export const ModeRepository = Symbol("ModeRepository");

@injectable()
export class ModeRepositoryImpl implements ModeRepository {
  getMode(): Mode {
    return mode;
  }

  setMode(newMode: Mode): void {
    mode = newMode;
  }
}
