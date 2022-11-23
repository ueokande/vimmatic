import {
  KeymapsForm,
  SearchEngineForm,
  PropertiesForm,
  FullBlacklistForm,
  PartialBlacklistForm,
  SettingsForm,
} from "./schema";
import Settings from "../shared/Settings";
import Keymaps from "../shared/Keymaps";
import Search from "../shared/Search";
import Properties from "../shared/Properties";
import Blacklist from "../shared/Blacklist";
import { BlacklistItem } from "../shared/Blacklist";
import { serialize, deserialize } from "../settings";

const keymapsToForm = (keymaps: Keymaps): KeymapsForm => {
  return Object.fromEntries(
    keymaps.entries().map(([key, { type, ...args }]) => {
      let name = type;
      if (Object.keys(args).length > 0) {
        name += "?" + JSON.stringify(args);
      }
      return [name, key];
    })
  );
};

const keymapsFromForm = (form: KeymapsForm): Keymaps => {
  const keymaps = Object.fromEntries(
    Object.entries(form).map(([name, keys]) => {
      const [type, argStr] = name.split("?");
      let args = {};
      if (argStr) {
        args = JSON.parse(argStr);
      }
      return [keys, { type, ...args }];
    })
  );
  return new Keymaps(keymaps);
};

const searchEnginesToForm = (search: Search): SearchEngineForm => {
  const engines = Object.entries(search.engines).map(([name, url]) => ({
    name,
    url,
  }));
  return { default: search.defaultEngine, engines: engines };
};

const searchEnginesFromForm = (form: SearchEngineForm): Search => {
  const engines = Object.fromEntries(
    form.engines.map(({ name, url }) => [name, url])
  );
  return new Search(form.default, engines);
};

const propertiesToForm = (properties: Properties): PropertiesForm => {
  return properties;
};

const propertiesFromForm = (form: PropertiesForm): Properties => {
  return form;
};

const fullBlacklistToForm = (blacklist: Blacklist): FullBlacklistForm => {
  return blacklist.items
    .filter((item) => !item.partial)
    .map((item) => item.pattern);
};

const blacklistFromFullBlacklist = (form: FullBlacklistForm): Blacklist => {
  const items = form.map((item) => new BlacklistItem(item, false, []));
  return new Blacklist(items);
};

const partialBlacklistToForm = (blacklist: Blacklist): PartialBlacklistForm => {
  return blacklist.items
    .filter((item) => item.partial)
    .map((item) => ({ pattern: item.pattern, keys: item.keys }));
};

const blacklistFromPartialBlacklist = (
  form: PartialBlacklistForm
): Blacklist => {
  const items = form.map(
    (item) => new BlacklistItem(item.pattern, true, item.keys)
  );
  return new Blacklist(items);
};

export const settingsToForm = (settings: Settings): SettingsForm => {
  return {
    keymaps: settings.keymaps && keymapsToForm(settings.keymaps),
    search: settings.search && searchEnginesToForm(settings.search),
    properties: settings.properties && propertiesToForm(settings.properties),
    fullBlacklist:
      settings.blacklist && fullBlacklistToForm(settings.blacklist),
    partialBlacklist:
      settings.blacklist && partialBlacklistToForm(settings.blacklist),
  };
};

export const settingsFromForm = (form: SettingsForm): Settings => {
  let blacklist = undefined;
  if (form.fullBlacklist) {
    blacklist = (blacklist || new Blacklist([])).combined(
      blacklistFromFullBlacklist(form.fullBlacklist)
    );
  }
  if (form.partialBlacklist) {
    blacklist = (blacklist || new Blacklist([])).combined(
      blacklistFromPartialBlacklist(form.partialBlacklist)
    );
  }
  return {
    keymaps: form.keymaps && keymapsFromForm(form.keymaps),
    search: form.search && searchEnginesFromForm(form.search),
    properties: form.properties && propertiesFromForm(form.properties),
    blacklist,
  };
};

export const settingsToText = (settings: Settings): string => {
  const json = serialize(settings);
  return JSON.stringify(json, undefined, 2);
};

export const settingsFromText = (text: string): Settings => {
  const json = JSON.parse(text);
  return deserialize(json);
};
