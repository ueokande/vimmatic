import OpenHomeOperator from "../../../../src/background/operators/impls/OpenHomeOperator";
import MockBrowserSettingRepository from "../../mock/MockBrowserSettingRepository";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("OpenHomeOperator", () => {
  describe("#run", () => {
    const mockTabsCreate = jest
      .spyOn(chrome.tabs, "create")
      .mockImplementation(() => Promise.resolve({}));
    const mockTabsUpdate = jest
      .spyOn(chrome.tabs, "update")
      .mockImplementation(() => Promise.resolve({}));
    const ctx = {} as OperatorContext;

    it("opens a home page of the browser into the current tab", async () => {
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
      ]);

      const sut = new OpenHomeOperator(browserSettingRepository);
      await sut.run(ctx, { newTab: false });

      expect(mockTabsUpdate).toHaveBeenCalledWith({
        url: "https://example.net/",
      });
    });

    it("opens a home page of the browser into a new tab", async () => {
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
      ]);

      const sut = new OpenHomeOperator(browserSettingRepository);
      await sut.run(ctx, { newTab: true });

      expect(mockTabsCreate).toHaveBeenCalledWith({
        url: "https://example.net/",
      });
    });

    it("opens home pages of the browser", async () => {
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
        "https://example.org/",
      ]);

      const sut = new OpenHomeOperator(browserSettingRepository);
      await sut.run(ctx, { newTab: false });

      expect(mockTabsCreate).toHaveBeenCalledWith({
        url: "https://example.net/",
      });
      expect(mockTabsCreate).toHaveBeenCalledWith({
        url: "https://example.org/",
      });
    });
  });
});
