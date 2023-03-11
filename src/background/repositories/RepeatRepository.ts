import { injectable } from "inversify";
import MemoryStorage from "../db/MemoryStorage";
import { Operation } from "../../shared/operations2";

export default interface RepeatRepository {
  getLastOperation(): Operation | null;

  setLastOperation(op: Operation): void;
}

@injectable()
export class RepeatRepositoryImpl implements RepeatRepository {
  private cache = new MemoryStorage<Operation | null>(
    RepeatRepositoryImpl.name,
    null
  );

  getLastOperation(): Operation | null {
    return this.cache.get();
  }

  setLastOperation(op: Operation): void {
    this.cache.set(op);
  }
}
