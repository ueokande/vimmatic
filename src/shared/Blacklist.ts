import Key, { fromKeymap } from "./Key";

const regexFromWildcard = (pattern: string): RegExp => {
  const regexStr = "^" + pattern.replace(/\*/g, ".*") + "$";
  return new RegExp(regexStr);
};

export class BlacklistItem {
  public readonly pattern: string;

  private regex: RegExp;

  public readonly partial: boolean;

  public readonly keys: string[];

  private readonly keyEntities: Key[];

  constructor(pattern: string, partial = false, keys: string[] = []) {
    this.pattern = pattern;
    this.regex = regexFromWildcard(pattern);
    this.partial = partial;
    this.keys = keys;
    this.keyEntities = this.keys.map((key) => fromKeymap(key));
  }

  matches(url: URL): boolean {
    return this.pattern.includes("/")
      ? this.regex.test(url.host + url.pathname)
      : this.regex.test(url.host);
  }

  includeKey(url: URL, key: Key): boolean {
    if (!this.matches(url) || !this.partial) {
      return false;
    }
    return this.keyEntities.some((k) => k.equals(key));
  }
}

export default class Blacklist {
  constructor(public readonly items: BlacklistItem[]) {}

  includesEntireBlacklist(url: URL): boolean {
    return this.items.some((item) => !item.partial && item.matches(url));
  }

  includeKey(url: URL, key: Key) {
    return this.items.some((item) => item.includeKey(url, key));
  }

  combined(other: Blacklist): Blacklist {
    return new Blacklist([...this.items, ...other.items]);
  }
}
