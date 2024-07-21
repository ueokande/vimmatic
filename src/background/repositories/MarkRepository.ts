import { provide } from "inversify-binding-decorators";
import { type LocalCache, LocalCacheImpl } from "../db/LocalStorage";

export type GlobalMark = {
  readonly tabId: number;
  readonly url: string;
  readonly x: number;
  readonly y: number;
};

export type LocalMark = {
  readonly x: number;
  readonly y: number;
};

type MarkData = {
  globals: { [key: string]: GlobalMark };
  locals: { [tabId: number]: { [key: string]: LocalMark } };
};

export interface MarkRepository {
  getGlobalMark(key: string): Promise<GlobalMark | undefined>;

  setGlobalMark(key: string, mark: GlobalMark): Promise<void>;

  getLocalMark(tabId: number, key: string): Promise<LocalMark | undefined>;

  setLocalMark(tabId: number, key: string, mark: LocalMark): Promise<void>;
}

export const MarkRepository = Symbol("MarkRepository");

@provide(MarkRepository)
export class MarkRepositoryImpl implements MarkRepository {
  constructor(
    private readonly cache: LocalCache<MarkData> = new LocalCacheImpl(
      MarkRepositoryImpl.name,
      { globals: {}, locals: {} },
    ),
  ) {}

  async getGlobalMark(key: string): Promise<GlobalMark | undefined> {
    const { globals } = await this.cache.getValue();
    return globals[key];
  }

  async setGlobalMark(key: string, mark: GlobalMark): Promise<void> {
    const data = await this.cache.getValue();
    data.globals[key] = mark;
    return this.cache.setValue(data);
  }

  async getLocalMark(
    tabId: number,
    key: string,
  ): Promise<LocalMark | undefined> {
    const { locals } = await this.cache.getValue();
    const marks = locals[tabId];
    if (!marks) {
      return undefined;
    }
    return marks[key];
  }

  async setLocalMark(
    tabId: number,
    key: string,
    mark: LocalMark,
  ): Promise<void> {
    const data = await this.cache.getValue();
    data.locals[tabId] = { ...data.locals[tabId], [key]: mark };
    return this.cache.setValue(data);
  }
}
