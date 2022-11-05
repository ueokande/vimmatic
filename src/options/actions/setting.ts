import * as actions from "./index";
import * as storages from "../storage";
import { SettingsForm, SettingsSource } from "../schema";
import {
  settingsFromForm,
  settingsFromText,
  settingsToForm,
  settingsToText,
} from "../serdes";

const saveForm = async (form: SettingsForm): Promise<actions.SettingAction> => {
  try {
    await storages.saveForm(form);
  } catch (e) {
    console.error(e);
    return {
      type: actions.SETTING_SHOW_ERROR,
      error: e.toString(),
    };
  }

  return setForm(form);
};

const saveText = async (text: string): Promise<actions.SettingAction> => {
  try {
    await storages.saveText(text);
  } catch (e) {
    console.error(e);
    return {
      type: actions.SETTING_SHOW_ERROR,
      error: e.toString(),
    };
  }

  return setText(text);
};

const switchToForm = (text: string): actions.SettingAction => {
  try {
    const settings = settingsFromText(text);
    const form = settingsToForm(settings);

    return {
      type: actions.SETTING_SWITCH_TO_FORM,
      form,
    };
  } catch (e) {
    return {
      type: actions.SETTING_SHOW_ERROR,
      error: e.toString(),
    };
  }
};

const switchToText = (form: SettingsForm): actions.SettingAction => {
  try {
    const settings = settingsFromForm(form);
    const text = settingsToText(settings);

    return {
      type: actions.SETTING_SWITCH_TO_TEXT,
      text,
    };
  } catch (e) {
    return {
      type: actions.SETTING_SHOW_ERROR,
      error: e.toString(),
    };
  }
};

const setText = (text: string): actions.SettingAction => {
  return {
    type: actions.SETTING_SET_SETTINGS,
    source: SettingsSource.Text,
    text,
  };
};

const setForm = (form: SettingsForm): actions.SettingAction => {
  return {
    type: actions.SETTING_SET_SETTINGS,
    source: SettingsSource.Form,
    form,
  };
};

const load = async (): Promise<actions.SettingAction> => {
  const source = await storages.loadSettingsSource();
  if (source === SettingsSource.Form) {
    const form = await storages.loadForm();
    return {
      type: actions.SETTING_SET_SETTINGS,
      source: SettingsSource.Form,
      form,
    };
  } else {
    const text = await storages.loadText();
    return {
      type: actions.SETTING_SET_SETTINGS,
      source: SettingsSource.Text,
      text,
    };
  }
};

export {
  saveForm,
  saveText,
  switchToForm,
  switchToText,
  load,
  setText,
  setForm,
};
