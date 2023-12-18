import HintRepository from "../../../src/background/repositories/HintRepository";

export default class MockHintRepository implements HintRepository {
  startHintMode(
    _opts: { newTab: boolean; background: boolean },
    _hints: string[],
  ): Promise<void> {
    throw new Error("not implemented");
  }

  stopHintMode(): Promise<void> {
    throw new Error("not implemented");
  }

  isEnabled(): Promise<boolean> {
    throw new Error("not implemented");
  }

  getOption(): Promise<{ newTab: boolean; background: boolean }> {
    throw new Error("not implemented");
  }

  pushKey(_key: string): Promise<void> {
    throw new Error("not implemented");
  }

  popKey(): Promise<void> {
    throw new Error("not implemented");
  }

  getMatchedHints(): Promise<string[]> {
    throw new Error("not implemented");
  }

  getKeys(): Promise<string> {
    throw new Error("not implemented");
  }
}
