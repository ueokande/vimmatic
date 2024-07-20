import { injectable } from "inversify";

@injectable()
export class MarkHelper {
  isGlobalKey(key: string): boolean {
    return /^[A-Z0-9]$/.test(key);
  }
}
