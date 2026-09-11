import type { Blacklist } from "./blacklist";
import type { Keymaps } from "./keymaps";
import type { Properties } from "./properties";
import type { Search } from "./search";
import type { Styles } from "./styles";

export interface Settings {
  keymaps?: Keymaps;
  search?: Search;
  properties?: Properties;
  blacklist?: Blacklist;
  styles?: Styles;
}
