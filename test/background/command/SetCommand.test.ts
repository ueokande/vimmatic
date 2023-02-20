import SetCommand from "../../../src/background/command/SetCommand";
import { PropertyRegistryFactry } from "../../../src/background/property";
import MockPropertySettings from "../mock/MockPropertySettings";

describe("SetCommand", () => {
  const propertySettings = new MockPropertySettings();
  const propertyRegistry = new PropertyRegistryFactry().create();

  describe("exec", () => {
    const mockSetProperty = jest.spyOn(propertySettings, "setProperty");

    beforeEach(() => {
      mockSetProperty.mockClear();

      mockSetProperty.mockResolvedValue();
    });

    it("saves string property", async () => {
      const cmd = new SetCommand(propertySettings, propertyRegistry);
      await cmd.exec(false, "hintchars=abcdef");

      expect(mockSetProperty).toHaveBeenCalledWith("hintchars", "abcdef");
    });

    it("saves boolean property", async () => {
      const cmd = new SetCommand(propertySettings, propertyRegistry);

      await cmd.exec(false, "smoothscroll");
      expect(mockSetProperty).toHaveBeenCalledWith("smoothscroll", true);

      await cmd.exec(false, "nosmoothscroll");
      expect(mockSetProperty).toHaveBeenCalledWith("smoothscroll", false);
    });
  });

  describe("getCompletions", () => {
    it("returns all properties", async () => {
      const cmd = new SetCommand(propertySettings, propertyRegistry);
      const completions = await cmd.getCompletions(false, "");
      expect(completions).toHaveLength(1);
      expect(completions[0].items).toMatchObject([
        { primary: "hintchars", value: "hintchars" },
        { primary: "smoothscroll", value: "smoothscroll" },
        { primary: "nosmoothscroll", value: "nosmoothscroll" },
        { primary: "complete", value: "complete" },
        { primary: "colorscheme", value: "colorscheme" },
      ]);
    });

    it("returns properties matched with a prefix", async () => {
      const cmd = new SetCommand(propertySettings, propertyRegistry);
      const completions = await cmd.getCompletions(false, "c");
      expect(completions).toHaveLength(1);
      expect(completions[0].items).toMatchObject([
        { primary: "complete", value: "complete" },
        { primary: "colorscheme", value: "colorscheme" },
      ]);
    });
  });
});
