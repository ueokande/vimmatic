import { SettingRepositoryImpl } from "../../../src/content/repositories/SettingRepository";
import type { SettingClient } from "../../../src/content/client/SettingClient";
import type { Settings } from "../../../src/shared/settings";
import { deserialize } from "../../../src/settings";
import { describe, beforeEach, it, vi, expect } from "vitest";

class MockSettingClient implements SettingClient {
  load(): Promise<Settings> {
    throw new Error("not implemented");
  }
}

describe("SettingRepositoryImpl", () => {
  const settingClient = new MockSettingClient();
  const mockLoad = vi.spyOn(settingClient, "load");

  beforeEach(() => {
    mockLoad.mockClear();
  });

  it("updates and gets current value", async () => {
    const settings = deserialize({
      search: {
        default: "google",
        engines: {
          google: "https://google.com/?q={}",
        },
      },
      properties: {
        hintchars: "abcd1234",
        smoothscroll: false,
        complete: "sbh",
      },
    });

    mockLoad.mockResolvedValue(settings);
    const sut = new SettingRepositoryImpl(settingClient);

    await sut.reload();

    expect(sut.getSearch().defaultEngine).toBe("google");
    expect(sut.getProperties()).toMatchObject({
      hintchars: "abcd1234",
      smoothscroll: false,
      complete: "sbh",
    });
  });

  it("returns default values", async () => {
    const settings = deserialize({});

    mockLoad.mockResolvedValue(settings);
    const sut = new SettingRepositoryImpl(settingClient);

    await sut.reload();

    expect(sut.getKeymaps().entries().length).not.toBe(0);
    expect(sut.getBlacklist().items.length).toBe(0);
    expect(sut.getSearch().defaultEngine).toBe("google");
    expect(sut.getProperties()).toMatchObject({
      hintchars: "abcdefghijklmnopqrstuvwxyz",
      smoothscroll: false,
      complete: "sbh",
    });
    expect(sut.getStyle("hint")).toMatchObject({
      "background-color": "yellow",
    });
  });
});
