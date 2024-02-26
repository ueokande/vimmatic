import type { LocalCache } from "../../../src/background/db/LocalStorage";

export default class MockLocalStorage<T> implements LocalCache<T> {
  private value: T | undefined;

  constructor(private readonly initValue: T) {}

  async setValue(value: T): Promise<void> {
    this.value = value;
  }

  async getValue(): Promise<T> {
    if (typeof this.value === "undefined") {
      return this.initValue;
    }
    return this.value;
  }
}
