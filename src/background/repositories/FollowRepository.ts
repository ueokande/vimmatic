import { injectable } from "inversify";
import MemoryStorage from "../infrastructures/MemoryStorage";

export default interface FollowRepository {
  startFollowMode(
    opts: { newTab: boolean; background: boolean },
    hints: string[]
  ): void;

  stopFollowMode(): void;

  isEnabled(): boolean;

  getOption(): { newTab: boolean; background: boolean };

  pushKey(key: string): void;

  popKey(): void;

  getMatchedHints(): string[];

  getKeys(): string;
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
export class FollowRepositoryImpl implements FollowRepository {
  private readonly cache = new MemoryStorage<State>(FollowRepositoryImpl.name, {
    enabled: false,
    option: { newTab: false, background: false },
    hints: [],
    keys: [],
  });

  startFollowMode(
    option: { newTab: boolean; background: boolean },
    hints: string[]
  ): void {
    const state: State = {
      enabled: true,
      option,
      hints,
      keys: [],
    };
    this.cache.set(state);
  }

  stopFollowMode(): void {
    const state = this.cache.get();
    state.enabled = false;
    this.cache.set(state);
  }

  isEnabled(): boolean {
    const { enabled } = this.cache.get();
    return enabled;
  }

  getOption(): { newTab: boolean; background: boolean } {
    const { option } = this.cache.get();
    return option;
  }
  pushKey(key: string): void {
    const state = this.cache.get();
    state.keys.push(key);
    this.cache.set(state);
  }

  popKey(): void {
    const state = this.cache.get();
    state.keys.pop();
    this.cache.set(state);
  }

  getMatchedHints(): string[] {
    const state = this.cache.get();
    const prefix = state.keys.join("");
    return state.hints.filter((t) => t.startsWith(prefix));
  }

  getKeys(): string {
    const { keys } = this.cache.get();
    return keys.join("");
  }
}
