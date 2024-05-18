import AddonEnabledUseCase from "../../../src/background/usecases/AddonEnabledUseCase";
import MockAddonEnabledRepository from "../mock/MockAddonEnabledRepository";
import MockToolbarPresenter from "../mock/MockToolbarPresenter";
import { describe, it, vi, expect } from "vitest";

describe("AddonEnabledUseCase", () => {
  vi.spyOn(chrome.tabs.onActivated, "addListener").mockReturnValue();

  describe("#enable", () => {
    it("sets enabled and updates toolbar", async () => {
      const addonEnabledRepository = new MockAddonEnabledRepository();
      const toolbarPresenter = new MockToolbarPresenter();
      const sut = new AddonEnabledUseCase(
        toolbarPresenter,
        addonEnabledRepository,
      );
      const mockRepositoryEnable = vi
        .spyOn(addonEnabledRepository, "enable")
        .mockResolvedValue();
      const mockToolbarSetEnabled = vi
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
      const mockRepositoryDisable = vi
        .spyOn(addonEnabledRepository, "disable")
        .mockResolvedValue();
      const mockToolbarSetEnabled = vi
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
      const mockRepositoryToggle = vi
        .spyOn(addonEnabledRepository, "toggle")
        .mockResolvedValue(false);
      const mockToolbarSetEnabled = vi
        .spyOn(toolbarPresenter, "setEnabled")
        .mockResolvedValue();

      await sut.toggle();

      expect(mockRepositoryToggle).toHaveBeenCalledWith();
      expect(mockToolbarSetEnabled).toHaveBeenCalledWith(false);
    });
  });
});
