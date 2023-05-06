import type Keymaps from "./Keymaps";
import type Search from "./Search";
import type Properties from "./Properties";
import type Blacklist from "./Blacklist";
import type Styles from "./Styles";

type Settings = {
  keymaps?: Keymaps;
  search?: Search;
  properties?: Properties;
  blacklist?: Blacklist;
  styles?: Styles;
};

export default Settings;
