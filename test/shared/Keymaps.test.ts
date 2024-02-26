import { Keymaps } from "../../src/shared/keymaps";

describe("Keymaps", () => {
  describe("#combine", () => {
    it("returns combined keymaps", () => {
      const keymaps1 = new Keymaps({
        k: { type: "scroll.vertically", props: { count: -1 } },
        j: { type: "scroll.vertically", props: { count: 1 } },
      });
      const keymap2 = new Keymaps({
        n: { type: "find.next", props: {} },
        N: { type: "find.prev", props: {} },
      });
      const combined = keymaps1.combine(keymap2);

      const entries = combined
        .entries()
        .sort(([name1], [name2]) => name1.localeCompare(name2));
      expect(entries).toEqual([
        ["j", { type: "scroll.vertically", props: { count: 1 } }],
        ["k", { type: "scroll.vertically", props: { count: -1 } }],
        ["n", { type: "find.next", props: {} }],
        ["N", { type: "find.prev", props: {} }],
      ]);
    });

    it("overrides current keymaps", () => {
      const keymaps1 = new Keymaps({
        k: { type: "scroll.vertically", props: { count: -1 } },
        j: { type: "scroll.vertically", props: { count: 1 } },
      });
      const keymap2 = new Keymaps({
        n: { type: "find.next", props: {} },
        j: { type: "find.prev", props: {} },
      });
      const combined = keymaps1.combine(keymap2);

      const entries = combined
        .entries()
        .sort(([name1], [name2]) => name1.localeCompare(name2));
      expect(entries).toEqual([
        ["j", { type: "find.prev", props: {} }],
        ["k", { type: "scroll.vertically", props: { count: -1 } }],
        ["n", { type: "find.next", props: {} }],
      ]);
    });
  });
});
