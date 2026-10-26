import { describe, expect, it, vi } from "vitest";
import type { AddressRepository } from "../../../src/content/repositories/AddressRepository";
import { AddonEnabledUseCase } from "../../../src/content/usecases/AddonEnabledUseCase";
import { Blacklist, BlacklistItem } from "../../../src/shared/blacklist";
import { MockAddonEnabledClient } from "../mock/MockAddonEnabledClient";
import { MockAddonEnabledRepository } from "../mock/MockAddonEnabledRepository";
import { MockConsoleFramePresenter } from "../mock/MockConsoleFramePresenter";
import { MockSettingRepository } from "../mock/MockSettingRepository";

const newSut = ({
  enabled = false,
  tabEnabled = true,
  url = "https://example.com/",
}: {
  enabled?: boolean;
  tabEnabled?: boolean;
  url?: string;
} = {}) => {
  const addonEnabledRepository = new MockAddonEnabledRepository(enabled);
  const consoleFramePresenter = new MockConsoleFramePresenter(enabled);
  const settingRepository = new MockSettingRepository();
  const addressRepository: AddressRepository = {
    getCurrentURL: () => new URL(url),
  };
  const addonEnabledClient = new MockAddonEnabledClient(tabEnabled);
  const sut = new AddonEnabledUseCase(
    addonEnabledRepository,
    consoleFramePresenter,
    settingRepository,
    addressRepository,
    addonEnabledClient,
  );
  return {
    sut,
    addonEnabledRepository,
    consoleFramePresenter,
    settingRepository,
  };
};

describe("AddonEnabledUseCase", () => {
  describe("#enable", () => {
    it("store and indicate as enabled", async () => {
      const { sut, addonEnabledRepository, consoleFramePresenter } = newSut({
        enabled: false,
      });

      sut.enable();

      expect(addonEnabledRepository.isEnabled()).toBeTruthy();
      expect(consoleFramePresenter.attached).toBeTruthy();
    });
  });

  describe("#disable", () => {
    it("store and indicate as disabled", async () => {
      const { sut, addonEnabledRepository, consoleFramePresenter } = newSut({
        enabled: true,
      });

      sut.disable();

      expect(addonEnabledRepository.isEnabled()).toBeFalsy();
      expect(consoleFramePresenter.attached).toBeFalsy();
    });
  });

  describe("#sync", () => {
    it("applies enabled state of the tab", async () => {
      const { sut, addonEnabledRepository } = newSut({
        enabled: false,
        tabEnabled: true,
      });

      await sut.sync();

      expect(addonEnabledRepository.isEnabled()).toBeTruthy();
    });

    it("applies disabled state of the tab", async () => {
      const { sut, addonEnabledRepository, consoleFramePresenter } = newSut({
        enabled: true,
        tabEnabled: false,
      });

      await sut.sync();

      expect(addonEnabledRepository.isEnabled()).toBeFalsy();
      expect(consoleFramePresenter.attached).toBeFalsy();
    });
  });

  describe("#applyTabEnabled", () => {
    it("keeps disabled on blacklisted page", async () => {
      const { sut, addonEnabledRepository, settingRepository } = newSut({
        enabled: false,
      });
      vi.spyOn(settingRepository, "getBlacklist").mockReturnValue(
        new Blacklist([new BlacklistItem("example.com")]),
      );

      sut.applyTabEnabled(true);

      expect(addonEnabledRepository.isEnabled()).toBeFalsy();
    });
  });

  describe("#isEnabled", () => {
    it("returns current addon enabled", () => {
      const { sut, addonEnabledRepository } = newSut({ enabled: true });

      addonEnabledRepository.enable();
      expect(sut.isEnabled()).toBeTruthy();

      addonEnabledRepository.disable();
      expect(sut.isEnabled()).toBeFalsy();
    });
  });
});
