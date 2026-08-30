import { describe, expect, vi, it } from "vitest";
import { requirePermission } from "../../../src/background/decorators/permissions";

describe("requirePermission decorator", () => {
  const mockPermissionsContains = vi
    .spyOn(chrome.permissions, "contains");

  it("calls original method when permission is granted", async () => {
    mockPermissionsContains.mockImplementation(() => Promise.resolve(true));

    class TestClass {
      @requirePermission("bookmarks")
      async testMethod(arg: string): Promise<string> {
        return `result: ${arg}`;
      }
    }

    const instance = new TestClass();
    const result = await instance.testMethod("test");

    expect(mockPermissionsContains).toHaveBeenCalledWith({
      permissions: ["bookmarks"],
    });
    expect(result).toBe("result: test");
  });

  it("throws error when permission is denied", async () => {
    mockPermissionsContains.mockImplementation(() => Promise.resolve(false));

    class TestClass {
      @requirePermission("bookmarks")
      async testMethod(): Promise<void> {}
    }

    const instance = new TestClass();

    await expect(instance.testMethod()).rejects.toThrow(
      "Bookmarks access was blocked due to lack of user activation.",
    );
  });
});
