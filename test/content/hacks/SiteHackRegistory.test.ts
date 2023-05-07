import { SiteHackRegistryImpl } from "../../../src/content/hacks/SiteHackRegistry";

describe("SiteHackRegistryImpl", () => {
  it("returns matched site hacks", () => {
    const h1 = {
      match: () => false,
      fromInput: () => false,
    };
    const h2 = {
      match: () => true,
      fromInput: () => false,
    };

    const sut = new SiteHackRegistryImpl();
    sut.register(h1);
    sut.register(h2);

    const matched = sut.get();

    expect(matched).toBe(h2);
  });
});
