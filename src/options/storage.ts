import { SettingsForm, SettingsSource } from "./schema";
import { settingsFromForm, settingsFromText, settingsToForm } from "./serdes";
import { serialize, defaultSettings, defaultJSONSettings } from "../settings";

export const saveForm = async (form: SettingsForm): Promise<void> => {
  const settings = settingsFromForm(form);
  return browser.storage.sync.set({
    settings: serialize(settings),
    settings_source: SettingsSource.Form,
    settings_form: form,
  });
};

export const saveText = async (text: string): Promise<void> => {
  const settings = settingsFromText(text);
  return browser.storage.sync.set({
    settings: serialize(settings),
    settings_source: SettingsSource.Text,
    settings_text: text,
  });
};

export const loadSettingsSource = async (): Promise<SettingsSource> => {
  const { settings_source: type } = await browser.storage.sync.get(
    "settings_source"
  );
  if (!type) {
    return SettingsSource.Text;
  }
  return type;
};

export const loadForm = async (): Promise<SettingsForm> => {
  const { settings_form: form } = await browser.storage.sync.get(
    "settings_form"
  );
  if (form) {
    return settingsToForm(defaultSettings);
  }
  return form;
};

export const loadText = async (): Promise<string> => {
  const { settings_text: text } = await browser.storage.sync.get(
    "settings_text"
  );
  if (!text) {
    return defaultJSONSettings;
  }
  return text;
};
