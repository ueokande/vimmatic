import SetCommand from "../../../src/background/command/SetCommand";
import type { CommandContext } from "../../../src/background/command/Command";
import { PropertyRegistryImpl } from "../../../src/background/property/PropertyRegistry";
import MockPropertySettings from "../mock/MockPropertySettings";
import MockConsoleClient from "../mock/MockConsoleClient";

const strprop1 = {
  name: () => "strprop1",
  description: () => "",
  type: () => "string" as const,
  defaultValue: () => "foo",
  validate: () => {},
};

const strprop2 = {
  name: () => "strprop2",
  description: () => "",
  type: () => "string" as const,
  defaultValue: () => "bar",
  validate: () => {},
};

const booleanprop = {
  name: () => "booleanprop",
  description: () => "",
  type: () => "boolean" as const,
  defaultValue: () => false,
  validate: () => {},
};

describe("SetCommand", () => {
  const propertySettings = new MockPropertySettings();
  const propertyRegistry = new PropertyRegistryImpl();
  const consoleClient = new MockConsoleClient();
  const ctx = {
    sender: {
      tabId: 10,
    },
  } as CommandContext;

  propertyRegistry.register(strprop1);
  propertyRegistry.register(strprop2);
  propertyRegistry.register(booleanprop);

  describe("exec", () => {
    const mockSetProperty = jest.spyOn(propertySettings, "setProperty");
    const mockGetProperty = jest.spyOn(propertySettings, "getProperty");
    const mockShowInfo = jest.spyOn(consoleClient, "showInfo");
    const cmd = new SetCommand(
      propertySettings,
      propertyRegistry,
      consoleClient,
    );

    beforeEach(() => {
      mockSetProperty.mockClear();
      mockSetProperty.mockResolvedValue();
      mockGetProperty.mockClear();
      mockShowInfo.mockClear();
      mockShowInfo.mockResolvedValue();
    });

    it("saves string property", async () => {
      await cmd.exec(ctx, false, "strprop1=newvalue");
      expect(mockSetProperty).toHaveBeenCalledWith("strprop1", "newvalue");
    });

    it("shows string value with non value", async () => {
      mockGetProperty.mockResolvedValue("saved-value");
      await cmd.exec(ctx, false, "strprop1");
      expect(mockShowInfo).toHaveBeenCalledWith(
        ctx.sender.tabId,
        "strprop1=saved-value",
      );
    });

    it("shows string value with ?-suffix", async () => {
      mockGetProperty.mockResolvedValue("saved-value");
      await cmd.exec(ctx, false, "strprop1?");
      expect(mockShowInfo).toHaveBeenCalledWith(
        ctx.sender.tabId,
        "strprop1=saved-value",
      );
    });

    it("shows truthly boolean value with ?-suffix", async () => {
      mockGetProperty.mockResolvedValue(true);
      await cmd.exec(ctx, false, "booleanprop?");
      expect(mockShowInfo).toHaveBeenCalledWith(
        ctx.sender.tabId,
        "booleanprop",
      );
    });

    it("shows falsy boolean value with ?-suffix", async () => {
      mockGetProperty.mockResolvedValue(false);
      await cmd.exec(ctx, false, "booleanprop?");
      expect(mockShowInfo).toHaveBeenCalledWith(
        ctx.sender.tabId,
        "nobooleanprop",
      );
    });

    it("saves boolean property", async () => {
      await cmd.exec(ctx, false, "booleanprop");
      expect(mockSetProperty).toHaveBeenCalledWith("booleanprop", true);

      await cmd.exec(ctx, false, "nobooleanprop");
      expect(mockSetProperty).toHaveBeenCalledWith("booleanprop", false);
    });

    it("shows all properties", async () => {
      mockGetProperty.mockImplementation((name: string) => {
        switch (name) {
          case "strprop1":
            return Promise.resolve("foo");
          case "strprop2":
            return Promise.resolve("bar");
          case "booleanprop":
            return Promise.resolve(false);
        }
        throw new Error("an error");
      });
      await cmd.exec(ctx, false, "");
      expect(mockShowInfo).toHaveBeenCalledWith(
        ctx.sender.tabId,
        "strprop1=foo\nstrprop2=bar\nnobooleanprop",
      );
    });

    it("throws error when invalid boolean statement", async () => {
      await expect(cmd.exec(ctx, false, "booleanprop=1")).rejects.toThrow(
        "Invalid",
      );
    });
  });

  describe("getCompletions", () => {
    it("returns all properties", async () => {
      const cmd = new SetCommand(
        propertySettings,
        propertyRegistry,
        consoleClient,
      );
      const completions = await cmd.getCompletions(false, "");
      expect(completions).toHaveLength(1);
      expect(completions[0].items).toMatchObject([
        { primary: "strprop1", value: "strprop1" },
        { primary: "strprop2", value: "strprop2" },
        { primary: "booleanprop", value: "booleanprop" },
        { primary: "nobooleanprop", value: "nobooleanprop" },
      ]);
    });

    it("returns properties matched with a prefix", async () => {
      const cmd = new SetCommand(
        propertySettings,
        propertyRegistry,
        consoleClient,
      );
      const completions = await cmd.getCompletions(false, "str");
      expect(completions).toHaveLength(1);
      expect(completions[0].items).toMatchObject([
        { primary: "strprop1", value: "strprop1" },
        { primary: "strprop2", value: "strprop2" },
      ]);
    });

    it("returns properties matched with 'no' prefix", async () => {
      const cmd = new SetCommand(
        propertySettings,
        propertyRegistry,
        consoleClient,
      );
      const completions = await cmd.getCompletions(false, "no");
      expect(completions).toHaveLength(1);
      expect(completions[0].items).toMatchObject([
        { primary: "nobooleanprop", value: "nobooleanprop" },
      ]);
    });
  });
});
