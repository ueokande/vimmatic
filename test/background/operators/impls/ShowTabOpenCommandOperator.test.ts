import ShowTabOpenCommandOperator from "../../../../src/background/operators/impls/ShowTabOpenCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";
import type { OperatorContext } from "../../../../src/background/operators/types";

describe("ShowTabOpenCommandOperator", () => {
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockResolvedValue();
  const ctx = {
    sender: {
      tabId: 100,
      tab: { id: 100, url: "https://example.com/" },
    },
  } as OperatorContext;

  beforeEach(() => {
    showCommandSpy.mockReset();
  });

  describe("#run", () => {
    it("show command with tabopen command", async () => {
      const sut = new ShowTabOpenCommandOperator(consoleClient);
      await sut.run(ctx, { alter: false });

      expect(showCommandSpy).toHaveBeenCalledWith(100, "tabopen ");
    });

    it("show command with tabopen command and an URL of the current tab", async () => {
      const sut = new ShowTabOpenCommandOperator(consoleClient);
      await sut.run(ctx, { alter: true });

      expect(showCommandSpy).toHaveBeenCalledWith(
        100,
        "tabopen https://example.com/",
      );
    });
  });
});
