import { StyleSettingsImpl } from "../../../src/background/settings/StyleSettings";
import { MockSettingsRepository } from "../mock/MockSettingsRepository";
import { describe, beforeEach, it, vi, expect } from "vitest";

describe("StyleSettingsImpl", () => {
  const settingsRepository = new MockSettingsRepository();
  const styleSettings = new StyleSettingsImpl(settingsRepository);
  const mockLoad = vi.spyOn(settingsRepository, "load");

  beforeEach(() => {
    mockLoad.mockClear();
  });

  describe("getStyle", () => {
    it("returns default styles on empty settings", async () => {
      mockLoad.mockResolvedValue({});

      const css = await styleSettings.getStyle("hint");
      expect(css).toHaveProperty("background-color", "yellow");
    });

    it("returns default styles on empty styles property", async () => {
      mockLoad.mockResolvedValue({ styles: {} });

      const css = await styleSettings.getStyle("hint");
      expect(css).toHaveProperty("background-color", "yellow");
    });

    it("returns saved styles", async () => {
      mockLoad.mockResolvedValue({
        styles: { hint: { "background-color": "green" } },
      });

      const css = await styleSettings.getStyle("hint");
      expect(css).toHaveProperty("background-color", "green");
    });
  });
});
