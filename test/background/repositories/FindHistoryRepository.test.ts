import { FindHistoryRepositoryImpl } from "../../../src/background/repositories/FindHistoryRepository";
import MockLocalStorage from "../mock/MockLocalStorage";

describe(FindHistoryRepositoryImpl.name, () => {
  it("appends keywords", async () => {
    const sut = new FindHistoryRepositoryImpl(new MockLocalStorage([]));

    expect(await sut.query("")).toEqual([]);

    await sut.append("apple");
    expect(await sut.query("")).toEqual(["apple"]);

    await sut.append("banana");
    expect(await sut.query("")).toEqual(["banana", "apple"]);
  });

  it("make duplicated keyword latest searched keyword", async () => {
    const sut = new FindHistoryRepositoryImpl(new MockLocalStorage([]));

    await sut.append("apple");
    await sut.append("banana");
    await sut.append("cherry");
    await sut.append("date");
    expect(await sut.query("")).toEqual(["date", "cherry", "banana", "apple"]);

    await sut.append("banana");
    expect(await sut.query("")).toEqual(["banana", "date", "cherry", "apple"]);

    await sut.append("apple");
    expect(await sut.query("")).toEqual(["apple", "banana", "date", "cherry"]);

    await sut.append("apple");
    expect(await sut.query("")).toEqual(["apple", "banana", "date", "cherry"]);
  });

  it("filtered matched history items with a prefix", async () => {
    const sut = new FindHistoryRepositoryImpl(new MockLocalStorage([]));

    await sut.append("c");
    await sut.append("b");
    await sut.append("a");
    await sut.append("ccc");
    await sut.append("bbb");
    await sut.append("aaa");
    await sut.append("ccccc");
    await sut.append("bbbbb");
    await sut.append("aaaaa");

    expect(await sut.query("a")).toEqual(["aaaaa", "aaa", "a"]);
    expect(await sut.query("aa")).toEqual(["aaaaa", "aaa"]);
    expect(await sut.query("b")).toEqual(["bbbbb", "bbb", "b"]);
    expect(await sut.query("bb")).toEqual(["bbbbb", "bbb"]);
    expect(await sut.query("d")).toEqual([]);
  });

  it("throws an error when appending empty keyword", async () => {
    const sut = new FindHistoryRepositoryImpl(new MockLocalStorage([]));

    expect(sut.append("")).rejects.toThrow(TypeError);
  });
});
