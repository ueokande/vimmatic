import ShowOpenCommandOperator from "../../../../src/background/operators/impls/ShowOpenCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("ShowOpenCommandOperator", () => {
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
    it("show command with open command", async () => {
      const sut = new ShowOpenCommandOperator(consoleClient);
      await sut.run(ctx, { alter: false });

      expect(showCommandSpy).toHaveBeenCalledWith(100, "open ");
    });

    it("show command with open command and an URL of the current tab", async () => {
      const sut = new ShowOpenCommandOperator(consoleClient);
      await sut.run(ctx, { alter: true });

      expect(showCommandSpy).toHaveBeenCalledWith(
        100,
        "open https://example.com/",
      );
    });
  });
});
