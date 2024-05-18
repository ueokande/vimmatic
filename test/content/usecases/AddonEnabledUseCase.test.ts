import AddonEnabledUseCase from "../../../src/content/usecases/AddonEnabledUseCase";
import MockAddonEnabledRepository from "../mock/MockAddonEnabledRepository";
import MockConsoleFramePresenter from "../mock/MockConsoleFramePresenter";
import { describe, it, expect } from "vitest";

describe("AddonEnabledUseCase", () => {
  describe("#enable", () => {
    it("store and indicate as enabled", async () => {
      const addonEnabledRepository = new MockAddonEnabledRepository(false);
      const consoleFramePresenter = new MockConsoleFramePresenter(false);
      const sut = new AddonEnabledUseCase(
        addonEnabledRepository,
        consoleFramePresenter,
      );

      sut.enable();

      expect(addonEnabledRepository.isEnabled()).toBeTruthy();
      expect(consoleFramePresenter.attached).toBeTruthy();
    });
  });

  describe("#disable", () => {
    it("store and indicate as disabled", async () => {
      const addonEnabledRepository = new MockAddonEnabledRepository(true);
      const consoleFramePresenter = new MockConsoleFramePresenter(true);
      const sut = new AddonEnabledUseCase(
        addonEnabledRepository,
        consoleFramePresenter,
      );

      sut.disable();

      expect(addonEnabledRepository.isEnabled()).toBeFalsy();
      expect(consoleFramePresenter.attached).toBeFalsy();
    });
  });

  describe("#isEnabled", () => {
    it("returns current addon enabled", () => {
      const addonEnabledRepository = new MockAddonEnabledRepository(true);
      const consoleFramePresenter = new MockConsoleFramePresenter(true);
      const sut = new AddonEnabledUseCase(
        addonEnabledRepository,
        consoleFramePresenter,
      );

      addonEnabledRepository.enable();
      expect(sut.isEnabled()).toBeTruthy();

      addonEnabledRepository.disable();
      expect(sut.isEnabled()).toBeFalsy();
    });
  });
});
