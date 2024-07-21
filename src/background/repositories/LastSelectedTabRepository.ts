import { provide } from "inversify-binding-decorators";
import { type LocalCache, LocalCacheImpl } from "../db/LocalStorage";

export interface LastSelectedTabRepository {
  getLastSelectedTabId(): Promise<number | undefined>;

  setCurrentTabId(tabId: number): Promise<void>;
}

type State = {
  lastSelected?: number;
  currentSelected?: number;
};

export const LastSelectedTabRepository = Symbol("LastSelectedTabRepository");

@provide(LastSelectedTabRepository)
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
