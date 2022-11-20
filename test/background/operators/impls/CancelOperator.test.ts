import CancelOperator from "../../../../src/background/operators/impls/CancelOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("CancelOperator", () => {
  describe("#run", () => {
    it("hides console", async () => {
      jest
        .spyOn(browser.tabs, "query")
        .mockResolvedValue([{ id: 100 } as browser.tabs.Tab]);
      const consoleClient = new MockConsoleClient();
      const spy = jest
        .spyOn(consoleClient, "hide")
        .mockResolvedValueOnce(undefined);

      const sut = new CancelOperator(consoleClient);
      await sut.run();

      expect(spy).toBeCalledWith(100);
    });
  });
});
