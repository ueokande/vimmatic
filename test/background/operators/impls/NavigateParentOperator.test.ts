import NavigateParentOperator from "../../../../src/background/operators/impls/NavigateParentOperator";

describe("NavigateParentOperator", () => {
  const mockTabsUpdate = jest
    .spyOn(browser.tabs, "update")
    .mockResolvedValue({} as browser.tabs.Tab);

  beforeEach(() => {
    mockTabsUpdate.mockClear();
  });

  describe("#run", () => {
    it("opens a parent directory of the file in the URL", async () => {
      const ctx = {
        sender: {
          tab: {
            id: 100,
            url: "https://example.com/fruits/yellow/banana",
          } as browser.tabs.Tab,
        },
      };
      const sut = new NavigateParentOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toBeCalledWith({
        url: "https://example.com/fruits/yellow/",
      });
    });

    it("opens a parent directory of the directory in the URL", async () => {
      const ctx = {
        sender: {
          tab: {
            id: 100,
            url: "https://example.com/fruits/yellow/",
          } as browser.tabs.Tab,
        },
      };
      const sut = new NavigateParentOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toBeCalledWith({
        url: "https://example.com/fruits/",
      });
    });

    it("removes a hash in the URL", async () => {
      const ctx = {
        sender: {
          tab: {
            id: 100,
            url: "https://example.com/fruits/yellow/#top",
          } as browser.tabs.Tab,
        },
      };
      const sut = new NavigateParentOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toBeCalledWith({
        url: "https://example.com/fruits/yellow/",
      });
    });

    it("removes query parameters in the URL", async () => {
      const ctx = {
        sender: {
          tab: {
            id: 100,
            url: "https://example.com/search?q=apple",
          } as browser.tabs.Tab,
        },
      };
      const sut = new NavigateParentOperator();
      await sut.run(ctx);

      expect(mockTabsUpdate).toBeCalledWith({
        url: "https://example.com/search",
      });
    });
  });
});
