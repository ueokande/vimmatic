import { injectable } from "inversify";
import LocalCache, { LocalCacheImpl } from "../db/LocalStorage";

export default interface HintRepository {
  startHintMode(
    opts: { newTab: boolean; background: boolean },
    hints: string[],
  ): Promise<void>;

  stopHintMode(): Promise<void>;

  isEnabled(): Promise<boolean>;

  getOption(): Promise<{ newTab: boolean; background: boolean }>;

  pushKey(key: string): Promise<void>;

  popKey(): Promise<void>;

  getMatchedHints(): Promise<string[]>;

  getKeys(): Promise<string>;
}

type Option = {
  newTab: boolean;
  background: boolean;
};

type State = {
  enabled: boolean;
  option: Option;
  hints: string[];
  keys: string[];
};

@injectable()
export class HintRepositoryImpl implements HintRepository {
  constructor(
    private readonly cache: LocalCache<State> = new LocalCacheImpl(
      HintRepositoryImpl.name,
      {
        enabled: false,
        option: { newTab: false, background: false },
        hints: [],
        keys: [],
      },
    ),
  ) {}

  startHintMode(
    option: { newTab: boolean; background: boolean },
    hints: string[],
  ): Promise<void> {
    const state: State = {
      enabled: true,
      option,
      hints,
      keys: [],
    };
    return this.cache.setValue(state);
  }

  async stopHintMode(): Promise<void> {
    const state = await this.cache.getValue();
    state.enabled = false;
    await this.cache.setValue(state);
  }

  async isEnabled(): Promise<boolean> {
    const { enabled } = await this.cache.getValue();
    return enabled;
  }

  async getOption(): Promise<{ newTab: boolean; background: boolean }> {
    const { option } = await this.cache.getValue();
    return option;
  }

  async pushKey(key: string): Promise<void> {
    const state = await this.cache.getValue();
    state.keys.push(key);
    await this.cache.setValue(state);
  }

  async popKey(): Promise<void> {
    const state = await this.cache.getValue();
    state.keys.pop();
    await this.cache.setValue(state);
  }

  async getMatchedHints(): Promise<string[]> {
    const state = await this.cache.getValue();
    const prefix = state.keys.join("");
    return state.hints.filter((t) => t.startsWith(prefix));
  }

  async getKeys(): Promise<string> {
    const { keys } = await this.cache.getValue();
    return keys.join("");
  }
}
