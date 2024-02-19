import {
  PermanentSettingsRepository,
  TransientSettingsRepository,
} from "../../../src/background/settings/SettingsRepository";
import type Settings from "../../../src/shared/Settings";
import MockLocalStorage from "../mock/MockLocalStorage";

describe("PermanentSettingsRepository", () => {
  const mockStorageGet = jest.spyOn(chrome.storage.sync, "get");

  const sut = new PermanentSettingsRepository();

  beforeEach(() => {
    mockStorageGet.mockClear();
  });

  describe("#load", () => {
    it("returns default settings", async () => {
      mockStorageGet.mockResolvedValue({ settings: undefined });

      const settings = await sut.load();
      expect(settings.properties["complete"]).toBe("sbh");
    });

    it("returns current settings", async () => {
      mockStorageGet.mockResolvedValue({
        settings: {
          properties: {
            complete: "ssbbhh",
          },
        },
      });

      const settings = await sut.load();
      expect(settings.properties["complete"]).toBe("ssbbhh");
    });
  });

  describe("#save", () => {
    it("throws an error", () => {
      expect(sut.save({})).rejects.toThrow();
    });
  });
});

class MockSettingsRepository {
  private readonly listeners: Array<(settings: Settings) => unknown> = [];

  save(): Promise<void> {
    throw new Error("not implemented");
  }

  load(): Promise<Settings> {
    throw new Error("not implemented");
  }

  onChanged(l: (settings: Settings) => unknown) {
    this.listeners.push(l);
  }

  invalidate(settings: Settings) {
    this.listeners.forEach((l) => l(settings));
  }
}

describe("TransientSettingsRepository", () => {
  const permanent = new MockSettingsRepository();
  const mockPermanetLoad = jest.spyOn(permanent, "load");

  mockPermanetLoad.mockResolvedValue({
    properties: {
      complete: "sbh",
    },
  });

  beforeEach(() => {
    mockPermanetLoad.mockClear();
  });

  describe("#load", () => {
    const sut = new TransientSettingsRepository(
      permanent,
      new MockLocalStorage(undefined),
    );

    it("loads delegated value and caches it", async () => {
      const settings1 = await sut.load();
      expect(settings1.properties["complete"]).toBe("sbh");

      const settings2 = await sut.load();
      expect(settings2.properties["complete"]).toBe("sbh");

      expect(mockPermanetLoad).toHaveBeenCalledTimes(1);
    });
  });

  describe("#save", () => {
    const sut = new TransientSettingsRepository(
      permanent,
      new MockLocalStorage(undefined),
    );

    it("saves to a permanent storage", async () => {
      const settings1 = await sut.load();
      expect(settings1.properties["complete"]).toBe("sbh");

      await sut.save({ properties: { complete: "ssbbhh" } });

      const settings2 = await sut.load();
      expect(settings2.properties["complete"]).toBe("ssbbhh");
    });
  });

  describe("#sync", () => {
    const sut = new TransientSettingsRepository(
      permanent,
      new MockLocalStorage(undefined),
    );

    it("syncs to a permanent storage", async () => {
      const settings1 = await sut.load();
      expect(settings1.properties["complete"]).toBe("sbh");

      await sut.save({ properties: { complete: "ssbbhh" } });

      const settings2 = await sut.load();
      expect(settings2.properties["complete"]).toBe("ssbbhh");

      permanent.invalidate({
        properties: {
          complete: "hbs",
        },
      });

      const settings3 = await sut.load();
      expect(settings3.properties["complete"]).toBe("hbs");
    });
  });
});
