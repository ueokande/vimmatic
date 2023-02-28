import AddonEnabledUseCase from "../../../src/background/usecases/AddonEnabledUseCase";
import MockAddonEnabledRepository from "../mock/MockAddonEnabledRepository";
import MockToolbarPresenter from "../mock/MockToolbarPresenter";
import MockAddonEnabledClient from "../mock/MockAddonEnabledClient";

describe("AddonEnabledUseCase", () => {
  jest.spyOn(browser.tabs.onActivated, "addListener").mockReturnValue();
  const ctx = {
    sender: {
      tabId: 100,
      frameId: 0,
      tab: {
        id: 100,
        url: "https://example.com/",
        index: 0,
        highlighted: false,
        incognito: false,
        active: true,
        pinned: false,
      },
    },
  };

  describe("#enable", () => {
    it("set enabled on tab and toolbar", async () => {
      const addonEnabledRepository = new MockAddonEnabledRepository();
      const toolbarPresenter = new MockToolbarPresenter();
      const addonEnabledClient = new MockAddonEnabledClient();
      const sut = new AddonEnabledUseCase(
        toolbarPresenter,
        addonEnabledRepository,
        addonEnabledClient
      );
      const mockRepositoryEnable = jest
        .spyOn(addonEnabledRepository, "enable")
        .mockReturnValue();
      const mockClientEnable = jest
        .spyOn(addonEnabledClient, "enable")
        .mockResolvedValue();
      const mockToolbarSetEnabled = jest
        .spyOn(toolbarPresenter, "setEnabled")
        .mockResolvedValue();

      await sut.enable(ctx);

      expect(mockRepositoryEnable).toBeCalledWith();
      expect(mockClientEnable).toBeCalledWith(100);
      expect(mockToolbarSetEnabled).toBeCalledWith(true);
    });
  });

  describe("#disable", () => {
    it("set disabled on tab and toolbar", async () => {
      const addonEnabledRepository = new MockAddonEnabledRepository();
      const toolbarPresenter = new MockToolbarPresenter();
      const addonEnabledClient = new MockAddonEnabledClient();
      const sut = new AddonEnabledUseCase(
        toolbarPresenter,
        addonEnabledRepository,
        addonEnabledClient
      );
      const mockRepositoryDisable = jest
        .spyOn(addonEnabledRepository, "disable")
        .mockReturnValue();
      const mockClientDisable = jest
        .spyOn(addonEnabledClient, "disable")
        .mockResolvedValue();
      const mockToolbarSetEnabled = jest
        .spyOn(toolbarPresenter, "setEnabled")
        .mockResolvedValue();

      await sut.disable(ctx);

      expect(mockRepositoryDisable).toBeCalledWith();
      expect(mockClientDisable).toBeCalledWith(100);
      expect(mockToolbarSetEnabled).toBeCalledWith(false);
    });
  });
});
