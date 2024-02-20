import ReopenTabOperator from "../../../../src/background/operators/impls/ReopenTabOperator";
import defaultTab from "../../mock/defaultTab";

describe("ReopenTabOperator", () => {
  const mockSessionsRestore = jest
    .spyOn(chrome.sessions, "restore")
    .mockImplementation(() => Promise.resolve({ lastModified: 0 }));
  jest.spyOn(chrome.windows, "getCurrent").mockResolvedValue({
    id: 20,
    focused: true,
    incognito: false,
    alwaysOnTop: false,
  });
  jest.spyOn(chrome.sessions, "getRecentlyClosed").mockImplementation(() =>
    Promise.resolve([
      {
        lastModified: 0,
        tab: { ...defaultTab, sessionId: "100", id: 100, windowId: 10 },
      },
      {
        lastModified: 0,
        tab: { ...defaultTab, sessionId: "101", id: 101, windowId: 10 },
      },
      {
        lastModified: 0,
        tab: { ...defaultTab, sessionId: "102", id: 200, windowId: 20 },
      },
      {
        lastModified: 0,
        tab: { ...defaultTab, sessionId: "103", id: 201, windowId: 20 },
      },
    ]),
  );

  describe("#run", () => {
    it("reopens closed tabs", async () => {
      const sut = new ReopenTabOperator();
      await sut.run();
      expect(mockSessionsRestore).toHaveBeenCalledWith("102");
    });
  });
});
