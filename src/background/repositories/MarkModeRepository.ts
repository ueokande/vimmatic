import { injectable } from "inversify";
import LocalCache, { LocalCacheImpl } from "../db/LocalStorage";

export default interface MarkModeRepository {
  enableSetMode(): Promise<void>;
  enableJumpMode(): Promise<void>;
  isSetMode(): Promise<boolean>;
  isJumpMode(): Promise<boolean>;
  clearMode(): Promise<void>;
}

@injectable()
export class MarkModeRepositoryImpl implements MarkModeRepository {
  constructor(
    private readonly cache: LocalCache<
      "set" | "jump" | null
    > = new LocalCacheImpl(MarkModeRepositoryImpl.name, null),
  ) {}

  enableSetMode(): Promise<void> {
    return this.cache.setValue("set");
  }

  enableJumpMode(): Promise<void> {
    return this.cache.setValue("jump");
  }

  async isSetMode(): Promise<boolean> {
    return (await this.cache.getValue()) === "set";
  }

  async isJumpMode(): Promise<boolean> {
    return (await this.cache.getValue()) === "jump";
  }

  clearMode(): Promise<void> {
    return this.cache.setValue(null);
  }
}
