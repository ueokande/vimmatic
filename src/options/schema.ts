export type KeymapsForm = Record<string, string>;

export type SearchEngineForm = {
  default: string;
  engines: Array<{ name: string; url: string }>;
};

export type PropertiesForm = Record<string, string | number | boolean>;
export type FullBlacklistForm = Array<string>;
export type PartialBlacklistForm = Array<{
  pattern: string;
  keys: Array<string>;
}>;
export type SettingsForm = {
  keymaps?: KeymapsForm;
  search?: SearchEngineForm;
  properties?: PropertiesForm;
  fullBlacklist?: FullBlacklistForm;
  partialBlacklist?: PartialBlacklistForm;
};

export enum SettingsSource {
  Text = "text",
  Form = "form",
}
