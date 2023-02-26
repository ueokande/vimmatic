const db: { [key: string]: any } = {};

export default class MemoryStorage<T> {
  constructor(private readonly key: string, initValue: T) {
    if (!(key in db)) {
      this.set(initValue);
    }
  }

  set(value: T): void {
    const data = JSON.stringify(value);
    if (typeof data === "undefined") {
      throw new Error("value is not serializable");
    }
    db[this.key] = data;
  }

  get(): T {
    return JSON.parse(db[this.key]);
  }
}
