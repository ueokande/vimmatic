import type Keymaps from "./Keymaps";
import type Search from "./Search";
import type Properties from "./Properties";
import type Blacklist from "./Blacklist";

type Settings = {
  keymaps?: Keymaps;
  search?: Search;
  properties?: Properties;
  blacklist?: Blacklist;
};

export default Settings;
