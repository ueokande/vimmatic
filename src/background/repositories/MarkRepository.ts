import { injectable } from "inversify";
import MemoryStorage from "../infrastructures/MemoryStorage";
import GlobalMark from "../domains/GlobalMark";
import LocalMark from "../domains/LocalMark";

const MARK_KEY = "mark";

type MarkData = {
  globals: { [key: string]: GlobalMark };
  locals: { [tabId: number]: { [key: string]: LocalMark } };
};

export default interface MarkRepository {
  getGlobalMark(key: string): Promise<GlobalMark | undefined>;

  setGlobalMark(key: string, mark: GlobalMark): Promise<void>;

  getLocalMark(tabId: number, key: string): Promise<LocalMark | undefined>;

  setLocalMark(tabId: number, key: string, mark: LocalMark): Promise<void>;
}

@injectable()
export class MarkRepositoryImpl {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  getGlobalMark(key: string): Promise<GlobalMark | undefined> {
    const { globals } = this.getOrDefault();
    return Promise.resolve(globals[key]);
  }

  setGlobalMark(key: string, mark: GlobalMark): Promise<void> {
    const data = this.getOrDefault();
    data.globals[key] = mark;
    this.cache.set(MARK_KEY, data);

    return Promise.resolve();
  }

  getLocalMark(tabId: number, key: string): Promise<LocalMark | undefined> {
    const { locals } = this.getOrDefault();
    const marks = locals[tabId];
    if (!marks) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(marks[key]);
  }

  setLocalMark(tabId: number, key: string, mark: LocalMark): Promise<void> {
    const data = this.getOrDefault();
    data.locals[tabId] = { ...data.locals[tabId], [key]: mark };
    this.cache.set(MARK_KEY, data);

    return Promise.resolve();
  }

  private getOrDefault(): MarkData {
    return this.cache.get(MARK_KEY) || { globals: {}, locals: {} };
  }
}
