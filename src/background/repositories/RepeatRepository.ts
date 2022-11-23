import { injectable } from "inversify";
import MemoryStorage from "../infrastructures/MemoryStorage";
import { Operation } from "../../shared/operations2";

const REPEAT_KEY = "repeat";

export default interface RepeatRepository {
  getLastOperation(): Operation | undefined;

  setLastOperation(op: Operation): void;
}

@injectable()
export class RepeatRepositoryImpl implements RepeatRepository {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  getLastOperation(): Operation | undefined {
    return this.cache.get(REPEAT_KEY);
  }

  setLastOperation(op: Operation): void {
    this.cache.set(REPEAT_KEY, op);
  }
}
