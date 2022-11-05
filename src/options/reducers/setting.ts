import * as actions from "../actions";
import { SettingsForm, SettingsSource } from "../schema";

export interface State {
  source: SettingsSource;
  text?: string;
  form?: SettingsForm;
  error: string;
}

const defaultState: State = {
  source: SettingsSource.Text,
  text: "",
  error: "",
};

export default function reducer(
  state = defaultState,
  action: actions.SettingAction
): State {
  switch (action.type) {
    case actions.SETTING_SET_SETTINGS:
      return {
        ...state,
        source: action.source,
        text: action.text,
        form: action.form,
        error: "",
      };
    case actions.SETTING_SHOW_ERROR:
      return { ...state, error: action.error };
    case actions.SETTING_SWITCH_TO_FORM:
      return {
        ...state,
        error: "",
        source: SettingsSource.Form,
        form: action.form,
      };
    case actions.SETTING_SWITCH_TO_TEXT:
      return {
        ...state,
        error: "",
        source: SettingsSource.Text,
        text: action.text,
      };
    default:
      return state;
  }
}
