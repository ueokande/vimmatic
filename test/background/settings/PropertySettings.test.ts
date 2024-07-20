import { PropertySettingsImpl } from "../../../src/background/settings/PropertySettings";
import type {
  Property,
  PropertyType,
  PropertyTypeName,
} from "../../../src/background/property/types";
import { MockSettingsRepository } from "../mock/MockSettingsRepository";
import { MockPropertyRegistry } from "../mock/MockPropertyRegistry";
import { describe, beforeEach, it, vi, expect } from "vitest";

class MyProp implements Property {
  name(): string {
    return "myprop";
  }

  description(): string {
    return "this is myprop";
  }

  type(): PropertyTypeName {
    return "string";
  }

  defaultValue(): PropertyType {
    return "foo";
  }

  validate(value: PropertyType): void {
    if (value !== "foo" && value !== "bar") {
      throw new Error(`invalid property: ${value}`);
    }
  }
}

describe("PropertySettingsImpl", () => {
  const settingsRepository = new MockSettingsRepository();
  const propertyRegistry = new MockPropertyRegistry();
  const propertySettings = new PropertySettingsImpl(
    settingsRepository,
    propertyRegistry,
  );
  const mockGetProperty = vi.spyOn(propertyRegistry, "getProperty");
  const mockLoad = vi.spyOn(settingsRepository, "load");
  const mockSave = vi.spyOn(settingsRepository, "save");

  beforeEach(() => {
    mockGetProperty.mockClear();
    mockLoad.mockClear();
    mockSave.mockClear();
  });

  describe("getProperty", () => {
    it("returns saved property", async () => {
      mockGetProperty.mockReturnValue(new MyProp());
      mockLoad.mockResolvedValue({
        properties: {
          myprop: "bar",
        },
      });

      const v = await propertySettings.getProperty("myprop");
      expect(v).toBe("bar");
    });

    it("returns default value when property not set", async () => {
      mockGetProperty.mockReturnValue(new MyProp());
      mockLoad.mockResolvedValue({ properties: {} });

      const v = await propertySettings.getProperty("myprop");
      expect(v).toBe("foo");
    });

    it("returns default value when empty settings", async () => {
      mockGetProperty.mockReturnValue(new MyProp());
      mockLoad.mockResolvedValue({});

      const v = await propertySettings.getProperty("myprop");
      expect(v).toBe("foo");
    });

    it("returns default value when saved property is invalid", async () => {
      mockGetProperty.mockReturnValue(new MyProp());
      mockLoad.mockResolvedValue({
        properties: {
          myprop: "incorrect",
        },
      });

      const v = await propertySettings.getProperty("myprop");
      expect(v).toBe("foo");
    });

    it("throws an error when unknown property", async () => {
      mockGetProperty.mockReturnValue(undefined);
      mockLoad.mockResolvedValue({});

      await expect(propertySettings.getProperty("xxxxx")).rejects.toThrow(
        "Unknown property: xxxxx",
      );
    });
  });

  describe("setProperty", () => {
    it("saves new property value", async () => {
      mockGetProperty.mockReturnValue(new MyProp());
      mockLoad.mockResolvedValue({
        properties: {
          myprop: "foo",
        },
      });
      mockSave.mockResolvedValue();

      await propertySettings.setProperty("myprop", "bar");

      expect(mockSave).toHaveBeenCalledWith({
        properties: {
          myprop: "bar",
        },
      });
    });

    it("saves new property value when empty settings", async () => {
      mockGetProperty.mockReturnValue(new MyProp());
      mockLoad.mockResolvedValue({});
      mockSave.mockResolvedValue();

      await propertySettings.setProperty("myprop", "bar");

      expect(mockSave).toHaveBeenCalledWith({
        properties: {
          myprop: "bar",
        },
      });
    });

    it("throws an error when unknown property", async () => {
      mockGetProperty.mockReturnValue(undefined);
      mockLoad.mockResolvedValue({});

      await expect(propertySettings.setProperty("xxxxx", "")).rejects.toThrow(
        "Unknown property: xxxxx",
      );
    });

    it("throws an error when invalid value", async () => {
      mockGetProperty.mockReturnValue(new MyProp());
      mockLoad.mockResolvedValue({});

      await expect(
        propertySettings.setProperty("myprop", "fizz"),
      ).rejects.toThrow("invalid property: fizz");
    });
  });
});
