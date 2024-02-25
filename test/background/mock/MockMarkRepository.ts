import MarkRepository, {
  type LocalMark,
  type GlobalMark,
} from "../../../src/background/repositories/MarkRepository";

export default class MockMarkRepository implements MarkRepository {
  getGlobalMark(_key: string): Promise<GlobalMark | undefined> {
    throw new Error("not implemented");
  }

  setGlobalMark(_key: string, _mark: GlobalMark): Promise<void> {
    throw new Error("not implemented");
  }

  getLocalMark(_tabId: number, _key: string): Promise<LocalMark | undefined> {
    throw new Error("not implemented");
  }

  setLocalMark(_tabId: number, _key: string, _mark: LocalMark): Promise<void> {
    throw new Error("not implemented");
  }
}
