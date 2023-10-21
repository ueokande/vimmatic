export default interface LocalCache<T> {
  setValue(value: T): Promise<void>;

  getValue(): Promise<T>;
}

export class LocalCacheImpl<T> {
  constructor(
    private readonly key: string,
    private readonly initValue: T,
  ) {}

  setValue(value: T): Promise<void> {
    const data = JSON.stringify(value);
    return chrome.storage.local.set({ [this.key]: data });
  }

  async getValue(): Promise<T> {
    const kv = await chrome.storage.local.get(this.key);
    if (this.key in kv) {
      return JSON.parse(kv[this.key]);
    }
    return this.initValue;
  }
}
