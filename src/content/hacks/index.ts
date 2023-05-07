import RedditHack from "./sites/RedditHack";
import SiteHackRegistry, { SiteHackRegistryImpl } from "./SiteHackRegistry";

export class SiteHackRegistryFactry {
  create(): SiteHackRegistry {
    const r = new SiteHackRegistryImpl();
    r.register(new RedditHack());
    return r;
  }
}
