import SetCommand from "../../../src/background/command/SetCommand";
import PropertySettings from "../../../src/background/settings/PropertySettings";

class MockPropertySettings implements PropertySettings {
  setProperty(_key: string, _value: string | number | boolean): Promise<void> {
    throw new Error("not implemented");
  }
}

describe("SetCommand", () => {
  const propertySettings = new MockPropertySettings();
  const mockSetProperty = jest.spyOn(propertySettings, "setProperty");

  beforeEach(() => {
    mockSetProperty.mockClear();

    mockSetProperty.mockResolvedValue();
  });

  it("saves string property", async () => {
    const cmd = new SetCommand(propertySettings);
    await cmd.exec(false, "hintchars=abcdef");

    expect(mockSetProperty).toHaveBeenCalledWith("hintchars", "abcdef");
  });

  it("saves boolean property", async () => {
    const cmd = new SetCommand(propertySettings);

    await cmd.exec(false, "smoothscroll");
    expect(mockSetProperty).toHaveBeenCalledWith("smoothscroll", true);

    await cmd.exec(false, "nosmoothscroll");
    expect(mockSetProperty).toHaveBeenCalledWith("smoothscroll", false);
  });
});
