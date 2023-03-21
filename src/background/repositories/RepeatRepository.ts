import { injectable } from "inversify";
import LocalCache, { LocalCacheImpl } from "../db/LocalStorage";
import { Operation } from "../../shared/operations2";

export default interface RepeatRepository {
  getLastOperation(): Promise<Operation | null>;

  setLastOperation(op: Operation): Promise<void>;
}

@injectable()
export class RepeatRepositoryImpl implements RepeatRepository {
  constructor(
    private readonly cache: LocalCache<Operation | null> = new LocalCacheImpl(
      RepeatRepositoryImpl.name,
      null
    )
  ) {}

  getLastOperation(): Promise<Operation | null> {
    return this.cache.getValue();
  }

  setLastOperation(op: Operation): Promise<void> {
    return this.cache.setValue(op);
  }
}
