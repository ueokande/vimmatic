import type HintRepository from "../../../src/background/repositories/HintRepository";
import type HintTarget from "../../../src/background/hint/HintTarget";

export default class MockHintRepository implements HintRepository {
  startHintMode(
    _name: string,
    _opts: { newTab: boolean; background: boolean },
    _targets: HintTarget[],
  ): Promise<void> {
    throw new Error("not implemented");
  }

  getHintModeName(): Promise<string> {
    throw new Error("not implemented");
  }

  stopHintMode(): Promise<void> {
    throw new Error("not implemented");
  }

  getTargetFrameIds(): Promise<number[]> {
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

  getAllMatchedHints(): Promise<HintTarget[]> {
    throw new Error("not implemented");
  }

  getMatchedHints(_frameId: number): Promise<HintTarget[]> {
    throw new Error("not implemented");
  }
}
