import OpenHomeOperator from "../../../../src/background/operators/impls/OpenHomeOperator";
import MockBrowserSettingRepository from "../../mock/MockBrowserSettingRepository";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("OpenHomeOperator", () => {
  describe("#run", () => {
    const mockTabsCreate = jest
      .spyOn(chrome.tabs, "create")
      .mockResolvedValue({} as chrome.tabs.Tab);
    const mockTabsUpdate = jest
      .spyOn(chrome.tabs, "update")
      .mockResolvedValue({} as chrome.tabs.Tab);
    const ctx = {} as OperatorContext;

    it("opens a home page of the browser into the current tab", async () => {
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
      ]);

      const sut = new OpenHomeOperator(browserSettingRepository);
      await sut.run(ctx, { newTab: false });

      expect(mockTabsUpdate).toBeCalledWith({
        url: "https://example.net/",
      });
    });

    it("opens a home page of the browser into a new tab", async () => {
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
      ]);

      const sut = new OpenHomeOperator(browserSettingRepository);
      await sut.run(ctx, { newTab: true });

      expect(mockTabsCreate).toBeCalledWith({ url: "https://example.net/" });
    });

    it("opens home pages of the browser", async () => {
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
        "https://example.org/",
      ]);

      const sut = new OpenHomeOperator(browserSettingRepository);
      await sut.run(ctx, { newTab: false });

      expect(mockTabsCreate).toBeCalledWith({ url: "https://example.net/" });
      expect(mockTabsCreate).toBeCalledWith({ url: "https://example.org/" });
    });
  });
});
