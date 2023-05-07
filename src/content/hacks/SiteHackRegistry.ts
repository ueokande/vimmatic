import type SiteHack from "./SiteHack";

export default interface SiteHackRegistry {
  register(h: SiteHack): void;

  get(): SiteHack | undefined;
}

export class SiteHackRegistryImpl implements SiteHackRegistry {
  private readonly hacks: SiteHack[] = [];

  register(h: SiteHack): void {
    this.hacks.push(h);
  }

  get(): SiteHack | undefined {
    return this.hacks.find((h) => h.match());
  }
}
