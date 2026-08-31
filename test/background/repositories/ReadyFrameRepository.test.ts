import { ReadyFrameRepositoryImpl } from "../../../src/background/repositories/ReadyFrameRepository";
import type { LocalCache } from "../../../src/background/db/LocalStorage";
import { MockLocalStorage } from "../mock/MockLocalStorage";
import { describe, it, expect } from "vitest";

describe("ReadyFrameRepositoryImpl", () => {
  const sut = new ReadyFrameRepositoryImpl(new MockLocalStorage({}));

  it("get and set a keyword", async () => {
    expect(await sut.getFrameIds(1)).toBeUndefined;

    await sut.addFrameId(1, 10);
    await sut.addFrameId(1, 12);
    await sut.addFrameId(1, 11);
    await sut.addFrameId(2, 20);
    await sut.addFrameId(2, 21);
    await sut.addFrameId(2, 21);

    expect(await sut.getFrameIds(1)).toEqual([10, 11, 12]);
    expect(await sut.getFrameIds(2)).toEqual([20, 21]);

    await sut.removeFrameId(2, 21);
    expect(await sut.getFrameIds(2)).toEqual([20]);

    await sut.removeFrameId(2, 20);
    expect(await sut.getFrameIds(2)).toBeUndefined;
  });

  it("flush on tom frame ID", async () => {
    expect(await sut.getFrameIds(1)).toBeUndefined;

    await sut.addFrameId(1, 0);
    await sut.addFrameId(1, 10);
    await sut.addFrameId(1, 12);
    await sut.addFrameId(1, 11);
    await sut.addFrameId(2, 0);
    await sut.addFrameId(2, 20);
    await sut.addFrameId(2, 21);
    await sut.addFrameId(2, 21);

    await sut.addFrameId(1, 0);
    expect(await sut.getFrameIds(1)).toEqual([0]);

    await sut.removeFrameId(2, 0);
    expect(await sut.getFrameIds(2)).toBeUndefined;

    await sut.removeFrameId(2, 20);
    expect(await sut.getFrameIds(2)).toBeUndefined;
  });

  it("clears the tab entry when the last non-top frame is removed", async () => {
    const repo = new ReadyFrameRepositoryImpl(new MockLocalStorage({}));

    await repo.addFrameId(5, 50);
    expect(await repo.getFrameIds(5)).toEqual([50]);

    await repo.removeFrameId(5, 50);
    // The tab entry (tabId=5) must be cleared, not some unrelated key.
    expect(await repo.getFrameIds(5)).toBeUndefined();
  });

  it("serializes concurrent mutations without clobbering", async () => {
    // A cache whose getValue/setValue resolve on the microtask queue so that
    // unsynchronized read-modify-write cycles would interleave and lose writes.
    class AsyncCache implements LocalCache<{ [tabId: number]: number[] }> {
      private value: { [tabId: number]: number[] } = {};
      async getValue() {
        await Promise.resolve();
        return JSON.parse(JSON.stringify(this.value));
      }
      async setValue(value: { [tabId: number]: number[] }) {
        await Promise.resolve();
        this.value = JSON.parse(JSON.stringify(value));
      }
    }

    const repo = new ReadyFrameRepositoryImpl(new AsyncCache());

    await Promise.all([
      repo.addFrameId(1, 10),
      repo.addFrameId(1, 11),
      repo.addFrameId(1, 12),
      repo.addFrameId(1, 13),
    ]);

    expect(await repo.getFrameIds(1)).toEqual([10, 11, 12, 13]);
  });
});
