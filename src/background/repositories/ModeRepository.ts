import { provide } from "@inversifyjs/binding-decorators";
import { Mode } from "../../shared/mode";
import type { LocalCache } from "../db/LocalStorage";
import { LocalCacheImpl } from "../db/LocalStorage";

export interface ModeRepository {
  getMode(): Promise<Mode>;
  setMode(mode: Mode): Promise<void>;
}

type State = Mode;

export const ModeRepository = Symbol("ModeRepository");

@provide(ModeRepository)
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
