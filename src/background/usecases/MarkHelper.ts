import { injectable } from "inversify";

@injectable()
export default class MarkHelper {
  isGlobalKey(key: string): boolean {
    return /^[A-Z0-9]$/.test(key);
  }
}
