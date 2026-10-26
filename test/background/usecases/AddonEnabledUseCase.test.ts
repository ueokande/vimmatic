import { beforeEach, describe, expect, it, vi } from "vitest";
import { AddonEnabledUseCase } from "../../../src/background/usecases/AddonEnabledUseCase";
import { defaultSettings } from "../../../src/settings";
import { Blacklist, BlacklistItem } from "../../../src/shared/blacklist";
import { MockAddonEnabledClient } from "../mock/MockAddonEnabledClient";
import { MockAddonEnabledRepository } from "../mock/MockAddonEnabledRepository";
import { MockSettingsRepository } from "../mock/MockSettingsRepository";
import { MockTabPresenter } from "../mock/MockTabPresenter";
import { MockToolbarPresenter } from "../mock/MockToolbarPresenter";

describe("AddonEnabledUseCase", () => {
  const addonEnabledRepository = new MockAddonEnabledRepository();
  const toolbarPresenter = new MockToolbarPresenter();
  const addonEnabledClient = new MockAddonEnabledClient();
  const tabPresenter = new MockTabPresenter();
  const settingsRepository = new MockSettingsRepository();
  const sut = new AddonEnabledUseCase(
    toolbarPresenter,
    addonEnabledRepository,
    addonEnabledClient,
    tabPresenter,
    settingsRepository,
  );

  const mockSetIcon = vi.spyOn(toolbarPresenter, "setEnabled");
  const mockClientEnable = vi.spyOn(addonEnabledClient, "enable");
  const mockClientDisable = vi.spyOn(addonEnabledClient, "disable");

  beforeEach(async () => {
    await addonEnabledRepository.delete(10);
    await addonEnabledRepository.delete(20);
    mockSetIcon.mockResolvedValue();
    mockClientEnable.mockResolvedValue();
    mockClientDisable.mockResolvedValue();
    vi.spyOn(tabPresenter, "getTab").mockResolvedValue({
      id: 10,
      url: "https://example.com/",
    } as chrome.tabs.Tab);
    vi.spyOn(settingsRepository, "load").mockResolvedValue(defaultSettings);
  });

  describe("#disable", () => {
    it("disables only the tab and notifies frames and indicator", async () => {
      await sut.disable(10);

      expect(await addonEnabledRepository.isEnabled(10)).toBeFalsy();
      expect(await addonEnabledRepository.isEnabled(20)).toBeTruthy();
      expect(mockClientDisable).toHaveBeenCalledWith(10);
      expect(mockSetIcon).toHaveBeenCalledWith(10, false);
    });
  });

  describe("#enable", () => {
    it("enables the tab and notifies frames and indicator", async () => {
      await addonEnabledRepository.setEnabled(10, false);

      await sut.enable(10);

      expect(await addonEnabledRepository.isEnabled(10)).toBeTruthy();
      expect(mockClientEnable).toHaveBeenCalledWith(10);
      expect(mockSetIcon).toHaveBeenCalledWith(10, true);
    });
  });

  describe("#toggle", () => {
    it("toggles the tab", async () => {
      await sut.toggle(10);
      expect(await addonEnabledRepository.isEnabled(10)).toBeFalsy();
      expect(mockClientDisable).toHaveBeenCalledWith(10);
      expect(mockSetIcon).toHaveBeenLastCalledWith(10, false);

      await sut.toggle(10);
      expect(await addonEnabledRepository.isEnabled(10)).toBeTruthy();
      expect(mockClientEnable).toHaveBeenCalledWith(10);
      expect(mockSetIcon).toHaveBeenLastCalledWith(10, true);
    });

    it("stores state even if the tab has no content script", async () => {
      mockClientDisable.mockRejectedValue(new Error("no receiver"));
      vi.spyOn(console, "warn").mockImplementation(() => {});

      await sut.toggle(10);

      expect(await addonEnabledRepository.isEnabled(10)).toBeFalsy();
      expect(mockSetIcon).toHaveBeenCalledWith(10, false);
    });
  });

  describe("#refreshIndicator", () => {
    it("shows disabled on blacklisted page", async () => {
      vi.spyOn(settingsRepository, "load").mockResolvedValue({
        ...defaultSettings,
        blacklist: new Blacklist([new BlacklistItem("example.com")]),
      });

      await sut.refreshIndicator(10, "https://example.com/");

      expect(mockSetIcon).toHaveBeenCalledWith(10, false);
    });

    it("uses tab URL if not given", async () => {
      await sut.refreshIndicator(10);

      expect(tabPresenter.getTab).toHaveBeenCalledWith(10);
      expect(mockSetIcon).toHaveBeenCalledWith(10, true);
    });
  });
});
