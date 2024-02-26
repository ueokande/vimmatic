import { injectable } from "inversify";
import LocalCache, { LocalCacheImpl } from "../db/LocalStorage";
import type { HintTarget } from "../hint/types";

export default interface HintRepository {
  startHintMode(
    name: string,
    opts: { newTab: boolean; background: boolean },
    targets: HintTarget[],
  ): Promise<void>;

  getHintModeName(): Promise<string>;

  getOption(): Promise<{ newTab: boolean; background: boolean }>;

  pushKey(key: string): Promise<void>;

  popKey(): Promise<void>;

  getTargetFrameIds(): Promise<number[]>;

  getMatchedHints(frameId: number): Promise<HintTarget[]>;

  getAllMatchedHints(): Promise<HintTarget[]>;
}

type Option = {
  newTab: boolean;
  background: boolean;
};

type State = {
  name: string;
  option: Option;
  frameIds: number[];
  hintsByTag: Record<string, HintTarget>;
  keys: string[];
};

@injectable()
export class HintRepositoryImpl implements HintRepository {
  constructor(
    private readonly cache: LocalCache<State> = new LocalCacheImpl(
      HintRepositoryImpl.name,
      {
        name: "",
        option: { newTab: false, background: false },
        frameIds: [],
        hintsByTag: {},
        keys: [],
      },
    ),
  ) {}

  startHintMode(
    name: string,
    option: { newTab: boolean; background: boolean },
    hints: HintTarget[],
  ): Promise<void> {
    const hintsByTag: Record<
      string,
      {
        frameId: number;
        element: string;
        tag: string;
      }
    > = {};
    const frameIds = new Set<number>();
    for (const hint of hints) {
      hintsByTag[hint.tag] = hint;
      frameIds.add(hint.frameId);
    }

    const state: State = {
      name,
      option,
      hintsByTag,
      frameIds: Array.from(frameIds),
      keys: [],
    };
    return this.cache.setValue(state);
  }

  async getHintModeName(): Promise<string> {
    const state = await this.cache.getValue();
    return state.name;
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

  async getTargetFrameIds(): Promise<number[]> {
    return (await this.cache.getValue()).frameIds;
  }

  async getMatchedHints(frameId: number): Promise<HintTarget[]> {
    const state = await this.cache.getValue();
    const prefix = state.keys.join("");
    const matched: HintTarget[] = [];
    for (const [tag, hint] of Object.entries(state.hintsByTag)) {
      if (hint.frameId === frameId && tag.startsWith(prefix)) {
        matched.push(hint);
      }
    }
    return matched;
  }

  async getAllMatchedHints(): Promise<HintTarget[]> {
    const state = await this.cache.getValue();
    const prefix = state.keys.join("");
    const matched: HintTarget[] = [];
    for (const [tag, hint] of Object.entries(state.hintsByTag)) {
      if (tag.startsWith(prefix)) {
        matched.push(hint);
      }
    }
    return matched;
  }
}
