import { injectable } from "inversify";
import LocalCache, { LocalCacheImpl } from "../db/LocalStorage";

export default interface LastSelectedTabRepository {
  getLastSelectedTabId(): Promise<number | undefined>;

  setCurrentTabId(tabId: number): Promise<void>;
}

type State = {
  lastSelected?: number;
  currentSelected?: number;
};

@injectable()
export class LastSelectedTabRepositoryImpl
  implements LastSelectedTabRepository
{
  constructor(
    private readonly cache: LocalCache<State> = new LocalCacheImpl(
      LastSelectedTabRepositoryImpl.name,
      {},
    ),
  ) {}

  async getLastSelectedTabId(): Promise<number | undefined> {
    const { lastSelected } = await this.cache.getValue();
    return lastSelected;
  }

  async setCurrentTabId(tabId: number): Promise<void> {
    const { currentSelected } = await this.cache.getValue();

    await this.cache.setValue({
      lastSelected: currentSelected,
      currentSelected: tabId,
    });
  }
}
