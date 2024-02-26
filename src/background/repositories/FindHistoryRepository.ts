import { injectable } from "inversify";
import { type LocalCache, LocalCacheImpl } from "../db/LocalStorage";

type State = string[];

export interface FindHistoryRepository {
  append(keyword: string): Promise<void>;

  query(prefix: string): Promise<string[]>;
}

@injectable()
export class FindHistoryRepositoryImpl implements FindHistoryRepository {
  constructor(
    private readonly cache: LocalCache<State> = new LocalCacheImpl(
      FindHistoryRepositoryImpl.name,
      [],
    ),
  ) {}

  async append(keyword: string): Promise<void> {
    if (keyword === "") {
      throw new TypeError("keyword is empty");
    }

    const value = await this.cache.getValue();
    const index = value.indexOf(keyword);
    if (index >= 0) {
      return this.cache.setValue(
        [keyword].concat(
          value.slice(0, index),
          value.slice(index + 1, value.length),
        ),
      );
    }
    return this.cache.setValue([keyword].concat(value));
  }

  async query(prefix: string): Promise<string[]> {
    const value = await this.cache.getValue();
    return value.filter((v) => v.startsWith(prefix));
  }
}
