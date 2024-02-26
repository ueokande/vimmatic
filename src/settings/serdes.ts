import type {
  SerializedSettings,
  SerializedKeymaps,
  SerializedBlacklist,
  SerializedProperties,
  SerializedSearchEngine,
  SerializedStyles,
} from "./schema";
import { validateSerializedSettings } from "./schema";
import type { Operation } from "../shared/operation";
import type { Settings } from "../shared/settings";
import { Keymaps } from "../shared/keymaps";
import { Search } from "../shared/search";
import type { Properties } from "../shared/properties";
import { Blacklist } from "../shared/blacklist";
import type { Styles } from "../shared/styles";
import { BlacklistItem } from "../shared/blacklist";

const serializeKeymaps = (keymaps: Keymaps): SerializedKeymaps => {
  const obj: SerializedKeymaps = {};
  keymaps.entries().forEach(([key, op]) => {
    obj[key] = { ...op.props, type: op.type };
  });
  return obj;
};

const deserializeKeymaps = (json: SerializedKeymaps): Keymaps => {
  const entries: { [key: string]: Operation } = {};
  for (const [key, op] of Object.entries(json)) {
    const props: Omit<typeof op, "type"> = { ...op };
    delete props.type;
    entries[key] = {
      type: op.type,
      props,
    };
  }
  return new Keymaps(entries);
};

const serializeSearch = (search: Search): SerializedSearchEngine => {
  const obj: SerializedSearchEngine = {
    default: search.defaultEngine,
    engines: search.engines,
  };
  return obj;
};

const deserializeSearch = (json: SerializedSearchEngine): Search => {
  return new Search(json.default, json.engines);
};

const serializeProperties = (properties: Properties): SerializedProperties => {
  const obj: SerializedProperties = properties;
  return obj;
};

const deserializeProperties = (json: SerializedProperties): Properties => {
  return json;
};

const serializeBlacklist = (blacklist: Blacklist): SerializedBlacklist => {
  const obj: SerializedBlacklist = [];
  blacklist.items.forEach((item) => {
    if (item.partial) {
      obj.push({ url: item.pattern, keys: item.keys });
    } else {
      obj.push(item.pattern);
    }
  });
  return obj;
};

const deserializeBlacklist = (json: SerializedBlacklist): Blacklist => {
  const items = json.map((item) =>
    typeof item === "string"
      ? new BlacklistItem(item, false, [])
      : new BlacklistItem(item.url, true, item.keys),
  );
  return new Blacklist(items);
};

const serializeStyles = (styles: Styles): SerializedStyles => {
  const obj: SerializedStyles = styles;
  return obj;
};

const deserializeStyles = (json: SerializedStyles): Styles => {
  return json;
};

export const serializeSettings = (settings: Settings): SerializedSettings => {
  return {
    keymaps: settings.keymaps && serializeKeymaps(settings.keymaps),
    search: settings.search && serializeSearch(settings.search),
    properties: settings.properties && serializeProperties(settings.properties),
    blacklist: settings.blacklist && serializeBlacklist(settings.blacklist),
    styles: settings.styles && serializeStyles(settings.styles),
  };
};

export const deserializeSettings = (json: unknown): Settings => {
  validateSerializedSettings(json);
  const serialized = json as SerializedSettings;
  return {
    keymaps: serialized.keymaps && deserializeKeymaps(serialized.keymaps),
    search: serialized.search && deserializeSearch(serialized.search),
    properties:
      serialized.properties && deserializeProperties(serialized.properties),
    blacklist:
      serialized.blacklist && deserializeBlacklist(serialized.blacklist),
    styles: serialized.styles && deserializeStyles(serialized.styles),
  };
};
