import FollowRepository from "../../../src/background/repositories/FollowRepository";

export default class MockFollowRepository implements FollowRepository {
  startFollowMode(
    _opts: { newTab: boolean; background: boolean },
    _hints: string[]
  ): void {
    throw new Error("not implemented");
  }

  stopFollowMode(): void {
    throw new Error("not implemented");
  }

  isEnabled(): boolean {
    throw new Error("not implemented");
  }

  getOption(): { newTab: boolean; background: boolean } {
    throw new Error("not implemented");
  }

  pushKey(_key: string): void {
    throw new Error("not implemented");
  }

  popKey(): void {
    throw new Error("not implemented");
  }

  getMatchedHints(): string[] {
    throw new Error("not implemented");
  }

  getKeys(): string {
    throw new Error("not implemented");
  }
}
