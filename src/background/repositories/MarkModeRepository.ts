import { injectable } from "inversify";
import MemoryStorage from "../infrastructures/MemoryStorage";

const CACHEY_KEY = "mark.mode";

export default interface MarkModeRepository {
  enableSetMode(): Promise<void>;
  enableJumpMode(): Promise<void>;
  isSetMode(): Promise<boolean>;
  isJumpMode(): Promise<boolean>;
  clearMode(): Promise<void>;
}

@injectable()
export class MarkModeRepositoryImpl implements MarkModeRepository {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  async enableSetMode(): Promise<void> {
    this.cache.set(CACHEY_KEY, "set");
  }

  async enableJumpMode(): Promise<void> {
    this.cache.set(CACHEY_KEY, "jump");
  }

  async isSetMode(): Promise<boolean> {
    return this.cache.get(CACHEY_KEY) === "set";
  }

  async isJumpMode(): Promise<boolean> {
    return this.cache.get(CACHEY_KEY) === "jump";
  }

  async clearMode(): Promise<void> {
    this.cache.set(CACHEY_KEY, null);
  }
}
