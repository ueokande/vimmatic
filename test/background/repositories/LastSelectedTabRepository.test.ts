import { LastSelectedTabRepositoryImpl } from "../../../src/background/repositories/LastSelectedTabRepository";
import MockLocalStorage from "../mock/MockLocalStorage";

describe("LastSelectedTabRepositoryImpl", () => {
  it("enable and disable followings", async () => {
    const sut = new LastSelectedTabRepositoryImpl(new MockLocalStorage({}));

    expect(await sut.getLastSelectedTabId()).toBeUndefined();

    await sut.setCurrentTabId(10);
    expect(await sut.getLastSelectedTabId()).toBeUndefined();

    await sut.setCurrentTabId(20);
    expect(await sut.getLastSelectedTabId()).toBe(10);

    await sut.setCurrentTabId(30);
    expect(await sut.getLastSelectedTabId()).toBe(20);
  });
});
