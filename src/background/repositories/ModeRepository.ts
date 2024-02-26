import { injectable } from "inversify";
import { type LocalCache, LocalCacheImpl } from "../db/LocalStorage";
import { Mode } from "../../shared/mode";

export interface ModeRepository {
  getMode(): Promise<Mode>;
  setMode(mode: Mode): Promise<void>;
}

type State = Mode;

@injectable()
export class ModeRepositoryImpl implements ModeRepository {
  constructor(
    private readonly localCache: LocalCache<State> = new LocalCacheImpl<State>(
      ModeRepositoryImpl.name,
      Mode.Normal,
    ),
  ) {}

  getMode(): Promise<Mode> {
    return this.localCache.getValue();
  }

  setMode(mode: Mode): Promise<void> {
    return this.localCache.setValue(mode);
  }
}
