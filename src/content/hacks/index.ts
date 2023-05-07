import RedditHack from "./sites/RedditHack";
import YouTubeHack from "./sites/YouTubeHack";
import SiteHackRegistry, { SiteHackRegistryImpl } from "./SiteHackRegistry";

export class SiteHackRegistryFactry {
  create(): SiteHackRegistry {
    const r = new SiteHackRegistryImpl();
    r.register(new RedditHack());
    r.register(new YouTubeHack());
    return r;
  }
}
