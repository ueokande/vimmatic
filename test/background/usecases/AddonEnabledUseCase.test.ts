import AddonEnabledUseCase from "../../../src/background/usecases/AddonEnabledUseCase";
import MockAddonEnabledRepository from "../mock/MockAddonEnabledRepository";
import MockToolbarPresenter from "../mock/MockToolbarPresenter";

describe("AddonEnabledUseCase", () => {
  jest.spyOn(chrome.tabs.onActivated, "addListener").mockReturnValue();

  describe("#enable", () => {
    it("sets enabled and updates toolbar", async () => {
      const addonEnabledRepository = new MockAddonEnabledRepository();
      const toolbarPresenter = new MockToolbarPresenter();
      const sut = new AddonEnabledUseCase(
        toolbarPresenter,
        addonEnabledRepository,
      );
      const mockRepositoryEnable = jest
        .spyOn(addonEnabledRepository, "enable")
        .mockResolvedValue();
      const mockToolbarSetEnabled = jest
        .spyOn(toolbarPresenter, "setEnabled")
        .mockResolvedValue();

      await sut.enable();

      expect(mockRepositoryEnable).toHaveBeenCalledWith();
      expect(mockToolbarSetEnabled).toHaveBeenCalledWith(true);
    });
  });

  describe("#disable", () => {
    it("sets disabled and updates toolbar", async () => {
      const addonEnabledRepository = new MockAddonEnabledRepository();
      const toolbarPresenter = new MockToolbarPresenter();
      const sut = new AddonEnabledUseCase(
        toolbarPresenter,
        addonEnabledRepository,
      );
      const mockRepositoryDisable = jest
        .spyOn(addonEnabledRepository, "disable")
        .mockResolvedValue();
      const mockToolbarSetEnabled = jest
        .spyOn(toolbarPresenter, "setEnabled")
        .mockResolvedValue();

      await sut.disable();

      expect(mockRepositoryDisable).toHaveBeenCalledWith();
      expect(mockToolbarSetEnabled).toHaveBeenCalledWith(false);
    });
  });

  describe("#toggle", () => {
    it("toggles enabled and updates toolbar", async () => {
      const addonEnabledRepository = new MockAddonEnabledRepository();
      const toolbarPresenter = new MockToolbarPresenter();
      const sut = new AddonEnabledUseCase(
        toolbarPresenter,
        addonEnabledRepository,
      );
      const mockRepositoryToggle = jest
        .spyOn(addonEnabledRepository, "toggle")
        .mockResolvedValue(false);
      const mockToolbarSetEnabled = jest
        .spyOn(toolbarPresenter, "setEnabled")
        .mockResolvedValue();

      await sut.toggle();

      expect(mockRepositoryToggle).toHaveBeenCalledWith();
      expect(mockToolbarSetEnabled).toHaveBeenCalledWith(false);
    });
  });
});
