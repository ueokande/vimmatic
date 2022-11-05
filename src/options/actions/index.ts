import { SettingsForm, SettingsSource } from "../schema";

export const SETTING_SET_SETTINGS = "setting.set.settings";
export const SETTING_SHOW_ERROR = "setting.show.error";
export const SETTING_SWITCH_TO_FORM = "setting.switch.to.form";
export const SETTING_SWITCH_TO_TEXT = "setting.switch.to.text";

interface SettingSetSettingsAcion {
  type: typeof SETTING_SET_SETTINGS;
  source: SettingsSource;
  text?: string;
  form?: SettingsForm;
}

interface SettingShowErrorAction {
  type: typeof SETTING_SHOW_ERROR;
  error: string;
}

interface SettingSwitchToFormAction {
  type: typeof SETTING_SWITCH_TO_FORM;
  form: SettingsForm;
}

interface SettingSwitchToJsonAction {
  type: typeof SETTING_SWITCH_TO_TEXT;
  text: string;
}

export type SettingAction =
  | SettingSetSettingsAcion
  | SettingShowErrorAction
  | SettingSwitchToFormAction
  | SettingSwitchToJsonAction;
