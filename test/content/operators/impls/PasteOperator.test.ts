import PasteOperator from "../../../../src/content/operators/impls/PasteOperator";
import MockClipboardRepository from "../../mock/MockClipboardRepository";
import MockSettingRepository from "../../mock/MockSettingRepository";
import MockOperationClient from "../../mock/MockOperationClient";

describe("PasteOperator", () => {
  describe("#run", () => {
    it("open a search url", async () => {
      const clipboardRepository = new MockClipboardRepository("apple");
      const settingRepository = new MockSettingRepository();
      const operationClient = new MockOperationClient();
      const internalOpenUrlSpy = jest
        .spyOn(operationClient, "internalOpenUrl")
        .mockReturnValue(Promise.resolve());
      const sut = new PasteOperator(
        clipboardRepository,
        settingRepository,
        operationClient,
        false
      );

      await sut.run();

      expect(internalOpenUrlSpy).toBeCalledWith(
        "https://google.com/search?q=apple",
        false
      );
    });

    it("open a url", async () => {
      const clipboardRepository = new MockClipboardRepository(
        "https://example.com/"
      );
      const settingRepository = new MockSettingRepository();
      const operationClient = new MockOperationClient();
      const internalOpenUrlSpy = jest
        .spyOn(operationClient, "internalOpenUrl")
        .mockReturnValue(Promise.resolve());
      const sut = new PasteOperator(
        clipboardRepository,
        settingRepository,
        operationClient,
        false
      );

      await sut.run();

      expect(internalOpenUrlSpy).toBeCalledWith("https://example.com/", false);
    });
  });
});
