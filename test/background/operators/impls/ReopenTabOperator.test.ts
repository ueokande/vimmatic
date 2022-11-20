import ReopenTabOperator from "../../../../src/background/operators/impls/ReopenTabOperator";

describe("ReopenTabOperator", () => {
  const props = {
    index: 0,
    highlighted: false,
    active: true,
    incognito: false,
    pinned: false,
  };
  const mockSessionsRestore = jest
    .spyOn(browser.sessions, "restore")
    .mockResolvedValue({ lastModified: 0 });
  jest.spyOn(browser.windows, "getCurrent").mockResolvedValue({
    id: 20,
    focused: true,
    incognito: false,
    alwaysOnTop: false,
  });
  jest.spyOn(browser.sessions, "getRecentlyClosed").mockResolvedValue([
    {
      lastModified: 0,
      tab: { ...props, sessionId: "100", id: 100, windowId: 10 },
    },
    {
      lastModified: 0,
      tab: { ...props, sessionId: "101", id: 101, windowId: 10 },
    },
    {
      lastModified: 0,
      tab: { ...props, sessionId: "102", id: 200, windowId: 20 },
    },
    {
      lastModified: 0,
      tab: { ...props, sessionId: "103", id: 201, windowId: 20 },
    },
  ]);

  describe("#run", () => {
    it("reopens closed tabs", async () => {
      const sut = new ReopenTabOperator();
      await sut.run();
      expect(mockSessionsRestore).toBeCalledWith("102");
    });
  });
});
