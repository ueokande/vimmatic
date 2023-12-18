import { injectable } from "inversify";
import Mode from "../../shared/Mode";

let mode: Mode = Mode.Normal;

export default interface ModeRepository {
  getMode(): Mode;

  setMode(mode: Mode): void;
}

@injectable()
export class ModeRepositoryImpl implements ModeRepository {
  getMode(): Mode {
    return mode;
  }

  setMode(newMode: Mode): void {
    mode = newMode;
  }
}
