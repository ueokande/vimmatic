import MemoryStorage from "../../../src/background/db/MemoryStorage";

describe("MemoryStorage", () => {
  it("stores string value", () => {
    const cache = new MemoryStorage<string>("my-string", "init-string");
    expect(cache.get()).toBe("init-string");

    cache.set("second-value");
    expect(cache.get()).toBe("second-value");
  });

  it("stores number value", () => {
    const cache = new MemoryStorage<number>("my-number", 10);
    expect(cache.get()).toBe(10);

    cache.set(20);
    expect(cache.get()).toBe(20);
  });

  it("stores boolean value", () => {
    const cache = new MemoryStorage<boolean>("my-boolean", false);
    expect(cache.get()).toBeFalsy();

    cache.set(true);
    expect(cache.get()).toBeTruthy();
  });

  it("stores array value", () => {
    const cache = new MemoryStorage<number[]>("my-array", [1, 2, 3]);
    expect(cache.get()).toEqual([1, 2, 3]);

    cache.set([4, 5]);
    expect(cache.get()).toEqual([4, 5]);
  });

  it("stores object value", () => {
    const cache = new MemoryStorage<{ name: string; age: number }>(
      "my-object",
      { name: "alice", age: 14 }
    );
    expect(cache.get()).toEqual({ name: "alice", age: 14 });

    cache.set({ name: "bob", age: 21 });
    expect(cache.get()).toEqual({ name: "bob", age: 21 });
  });

  it("shares between different instance", () => {
    const cache1 = new MemoryStorage<string>("shared-db", "apple");
    const cache2 = new MemoryStorage<string>("shared-db", "banana");

    expect(cache1.get()).toEqual("apple");
    expect(cache2.get()).toEqual("apple");

    cache2.set("cherry");

    expect(cache1.get()).toEqual("cherry");
    expect(cache2.get()).toEqual("cherry");
  });

  it("stored cloned objects", () => {
    const recipe = { sugar: "300g", salt: "10g" };
    const cache = new MemoryStorage<{ sugar: string; salt: string }>(
      "recipe",
      recipe
    );

    recipe.salt = "20g";
    expect(cache.get()).toEqual({ sugar: "300g", salt: "10g" });
  });

  it("throws an error with unserializable objects", () => {
    const cache = new MemoryStorage<string>("unserializable-objects", "hello");
    expect(() => cache.set(setTimeout as any)).toThrow();
  });
});
