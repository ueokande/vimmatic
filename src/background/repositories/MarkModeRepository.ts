import { injectable } from "inversify";
import MemoryStorage from "../infrastructures/MemoryStorage";

export default interface MarkModeRepository {
  enableSetMode(): void;
  enableJumpMode(): void;
  isSetMode(): boolean;
  isJumpMode(): boolean;
  clearMode(): void;
}

@injectable()
export class MarkModeRepositoryImpl implements MarkModeRepository {
  private readonly cache = new MemoryStorage<"set" | "jump" | null>(
    MarkModeRepositoryImpl.name,
    null
  );

  enableSetMode(): void {
    this.cache.set("set");
  }

  enableJumpMode(): void {
    this.cache.set("jump");
  }

  isSetMode(): boolean {
    return this.cache.get() === "set";
  }

  isJumpMode(): boolean {
    return this.cache.get() === "jump";
  }

  clearMode(): void {
    this.cache.set(null);
  }
}
