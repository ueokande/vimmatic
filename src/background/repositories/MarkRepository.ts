import { injectable } from "inversify";
import MemoryStorage from "../db/MemoryStorage";
import GlobalMark from "../domains/GlobalMark";
import LocalMark from "../domains/LocalMark";

type MarkData = {
  globals: { [key: string]: GlobalMark };
  locals: { [tabId: number]: { [key: string]: LocalMark } };
};

export default interface MarkRepository {
  getGlobalMark(key: string): GlobalMark | undefined;

  setGlobalMark(key: string, mark: GlobalMark): void;

  getLocalMark(tabId: number, key: string): LocalMark | undefined;

  setLocalMark(tabId: number, key: string, mark: LocalMark): void;
}

@injectable()
export class MarkRepositoryImpl implements MarkRepository {
  private readonly cache = new MemoryStorage<MarkData>(
    MarkRepositoryImpl.name,
    { globals: {}, locals: {} }
  );

  getGlobalMark(key: string): GlobalMark | undefined {
    const { globals } = this.cache.get();
    return globals[key];
  }

  setGlobalMark(key: string, mark: GlobalMark): void {
    const data = this.cache.get();
    data.globals[key] = mark;
    this.cache.set(data);
  }

  getLocalMark(tabId: number, key: string): LocalMark | undefined {
    const { locals } = this.cache.get();
    const marks = locals[tabId];
    if (!marks) {
      return undefined;
    }
    return marks[key];
  }

  setLocalMark(tabId: number, key: string, mark: LocalMark): void {
    const data = this.cache.get();
    data.locals[tabId] = { ...data.locals[tabId], [key]: mark };
    this.cache.set(data);
  }
}
