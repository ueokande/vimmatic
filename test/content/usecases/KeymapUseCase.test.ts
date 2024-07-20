import { KeymapUseCase } from "../../../src/content/usecases/KeymapUseCase";
import { KeymapRepositoryImpl } from "../../../src/content/repositories/KeymapRepository";
import { fromKeymap } from "../../../src/shared/key";
import { deserialize } from "../../../src/settings";
import type { AddressRepository } from "../../../src/content/repositories/AddressRepository";
import { MockAddonEnabledRepository } from "../mock/MockAddonEnabledRepository";
import { MockSettingRepository } from "../mock/MockSettingRepository";
import { describe, beforeEach, it, expect } from "vitest";

class MockAddressRepository implements AddressRepository {
  constructor(private url: URL) {}

  getCurrentURL(): URL {
    return this.url;
  }
}

describe("KeymapUseCase", () => {
  describe("with no-digis keymaps", () => {
    const settings = deserialize({
      keymaps: {
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
        gg: { type: "scroll.top" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com")),
      );
    });

    it("returns matched operation", () => {
      expect(sut.nextOps(fromKeymap("k"))).toEqual({
        repeat: 1,
        op: {
          type: "scroll.vertically",
          props: { count: -1 },
        },
      });
      expect(sut.nextOps(fromKeymap("j"))).toEqual({
        repeat: 1,
        op: {
          type: "scroll.vertically",
          props: { count: 1 },
        },
      });
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toEqual({
        repeat: 1,
        op: {
          type: "scroll.top",
          props: {},
        },
      });
      expect(sut.nextOps(fromKeymap("z"))).toBeNull;
    });

    it("repeats n-times by numeric prefix and multiple key operations", () => {
      expect(sut.nextOps(fromKeymap("1"))).toBeNull;
      expect(sut.nextOps(fromKeymap("0"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toEqual({
        repeat: 10,
        op: {
          type: "scroll.top",
          props: {},
        },
      });
    });
  });

  describe("when keymaps containing numeric mappings", () => {
    const settings = deserialize({
      keymaps: {
        20: { type: "scroll.top" },
        g5: { type: "scroll.bottom" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com")),
      );
    });

    it("returns the matched operation ends with digit", () => {
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("5"))).toEqual({
        repeat: 1,
        op: {
          type: "scroll.bottom",
          props: {},
        },
      });
    });

    it("returns an operation matched the operation with digit keymaps", () => {
      expect(sut.nextOps(fromKeymap("2"))).toBeNull;
      expect(sut.nextOps(fromKeymap("0"))).toEqual({
        repeat: 1,
        op: {
          type: "scroll.top",
          props: {},
        },
      });
    });

    it("returns operations repeated by numeric prefix", () => {
      expect(sut.nextOps(fromKeymap("2"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("5"))).toEqual({
        repeat: 2,
        op: {
          type: "scroll.bottom",
          props: {},
        },
      });
    });

    it("does not matches with digit operation with numeric prefix", () => {
      expect(sut.nextOps(fromKeymap("3"))).toBeNull;
      expect(sut.nextOps(fromKeymap("2"))).toBeNull;
      expect(sut.nextOps(fromKeymap("0"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("5"))).toEqual({
        repeat: 320,
        op: {
          type: "scroll.bottom",
          props: {},
        },
      });
    });
  });

  describe("when the keys are mismatched with the operations", () => {
    const settings = deserialize({
      keymaps: {
        gg: { type: "scroll.top" },
        G: { type: "scroll.bottom" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com")),
      );
    });

    it("clears input keys with no-matched operations", () => {
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("x"))).toBeNull; // clear
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toEqual({
        repeat: 1,
        op: {
          type: "scroll.top",
          props: {},
        },
      });
    });

    it("clears input keys and the prefix with no-matched operations", () => {
      expect(sut.nextOps(fromKeymap("1"))).toBeNull;
      expect(sut.nextOps(fromKeymap("0"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("x"))).toBeNull; // clear
      expect(sut.nextOps(fromKeymap("1"))).toBeNull;
      expect(sut.nextOps(fromKeymap("0"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toEqual({
        repeat: 10,
        op: {
          type: "scroll.top",
          props: {},
        },
      });
    });
  });

  describe("when the site matches to the blacklist", () => {
    const settings = deserialize({
      keymaps: {
        k: { type: "scroll.vertically", count: -1 },
        a: { type: "addon.enable" },
        b: { type: "addon.toggle.enabled" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(false),
        new MockAddressRepository(new URL("https://example.com")),
      );
    });

    it("returns only ADDON_ENABLE and ADDON_TOGGLE_ENABLED operation", () => {
      expect(sut.nextOps(fromKeymap("k"))).toBeNull;
      expect(sut.nextOps(fromKeymap("a"))).toEqual({
        repeat: 1,
        op: {
          type: "addon.enable",
          props: {},
        },
      });
      expect(sut.nextOps(fromKeymap("b"))).toEqual({
        repeat: 1,
        op: {
          type: "addon.toggle.enabled",
          props: {},
        },
      });
    });
  });

  describe("when the site matches to the partial blacklist", () => {
    const settings = deserialize({
      keymaps: {
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
        gg: { type: "scroll.top" },
        G: { type: "scroll.bottom" },
      },
      blacklist: [
        { url: "example.com", keys: ["g"] },
        { url: "example.org", keys: ["<S-G>"] },
      ],
    });

    it("blocks keys in the partial blacklist", () => {
      let sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com")),
      );

      expect(sut.nextOps(fromKeymap("k"))).toEqual({
        repeat: 1,
        op: {
          type: "scroll.vertically",
          props: { count: -1 },
        },
      });
      expect(sut.nextOps(fromKeymap("j"))).toEqual({
        repeat: 1,
        op: {
          type: "scroll.vertically",
          props: { count: 1 },
        },
      });
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("G"))).toEqual({
        repeat: 1,
        op: {
          type: "scroll.bottom",
          props: {},
        },
      });

      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.org")),
      );

      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toEqual({
        repeat: 1,
        op: {
          type: "scroll.top",
          props: {},
        },
      });
      expect(sut.nextOps(fromKeymap("G"))).toBeNull;
    });
  });
});
