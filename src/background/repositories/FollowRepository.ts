import { injectable } from "inversify";
import MemoryStorage from "../infrastructures/MemoryStorage";

export default interface FollowRepository {
  startFollowMode(
    opts: { newTab: boolean; background: boolean },
    hints: string[]
  ): Promise<void>;

  stopFollowMode(): Promise<void>;

  isEnabled(): Promise<boolean>;

  getOption(): Promise<{ newTab: boolean; background: boolean }>;

  pushKey(key: string): Promise<void>;

  popKey(): Promise<void>;

  getMatchedHints(): Promise<string[]>;

  getKeys(): Promise<string>;
}

const FOLLOW_REPOSITORY_KEY = "follow.repository";
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
export class FollowRepositoryImpl {
  private cache: MemoryStorage = new MemoryStorage();

  async startFollowMode(
    option: { newTab: boolean; background: boolean },
    hints: string[]
  ): Promise<void> {
    const state: State = {
      enabled: true,
      option,
      hints,
      keys: [],
    };
    this.cache.set(FOLLOW_REPOSITORY_KEY, state);
  }

  async stopFollowMode(): Promise<void> {
    const state = this.getOrDefault();
    state.enabled = false;
    this.cache.set(FOLLOW_REPOSITORY_KEY, state);
  }

  async isEnabled(): Promise<boolean> {
    const { enabled } = this.getOrDefault();
    return enabled;
  }

  async getOption(): Promise<{ newTab: boolean; background: boolean }> {
    const { option } = this.getOrDefault();
    return option;
  }
  async pushKey(key: string): Promise<void> {
    const state = this.getOrDefault();
    state.keys.push(key);
    this.cache.set(FOLLOW_REPOSITORY_KEY, state);
  }

  async popKey(): Promise<void> {
    const state = this.getOrDefault();
    state.keys.pop();
    this.cache.set(FOLLOW_REPOSITORY_KEY, state);
  }

  async getMatchedHints(): Promise<string[]> {
    const state = this.getOrDefault();
    const prefix = state.keys.join("");
    return state.hints.filter((t) => t.startsWith(prefix));
  }

  async getKeys(): Promise<string> {
    const { keys } = this.getOrDefault();
    return keys.join("");
  }

  private getOrDefault(): State {
    const state = this.cache.get(FOLLOW_REPOSITORY_KEY);
    if (state) {
      return state;
    }
    return {
      enabled: false,
      option: { newTab: false, background: false },
      hints: [],
      keys: [],
    };
  }
}
