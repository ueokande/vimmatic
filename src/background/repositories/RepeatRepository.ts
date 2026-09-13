import { provide } from "@inversifyjs/binding-decorators";
import type { Operation } from "../../shared/operation";
import type { LocalCache } from "../db/LocalStorage";
import { LocalCacheImpl } from "../db/LocalStorage";

export interface RepeatRepository {
  getLastOperation(): Promise<Operation | null>;

  setLastOperation(op: Operation): Promise<void>;
}

export const RepeatRepository = Symbol("RepeatRepository");

@provide(RepeatRepository)
export class RepeatRepositoryImpl implements RepeatRepository {
  constructor(
    private readonly cache: LocalCache<Operation | null> = new LocalCacheImpl(
      RepeatRepositoryImpl.name,
      null,
    ),
  ) {}

  getLastOperation(): Promise<Operation | null> {
    return this.cache.getValue();
  }

  setLastOperation(op: Operation): Promise<void> {
    return this.cache.setValue(op);
  }
}
