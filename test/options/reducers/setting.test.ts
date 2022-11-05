import * as actions from "../../../src/options/actions";
import settingReducer from "../../../src/options/reducers/setting";
import { SettingsSource } from "../../../src/options/schema";

describe("options setting reducer", () => {
  it("return the initial state", () => {
    const state = settingReducer(undefined, {} as any);
    expect(state).toHaveProperty("source", "text");
    expect(state).toHaveProperty("error", "");
  });

  it("return next state for SETTING_SET_SETTINGS", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SET_SETTINGS,
      source: SettingsSource.Text,
      text: "{  }",
      form: {
        fullBlacklist: ["example.com"],
      },
    };
    const state = settingReducer(undefined, action);
    expect(state.source).toEqual("text");
    expect(state.text).toEqual("{  }");
    expect(state.form).toMatchObject({
      fullBlacklist: ["example.com"],
    });
  });

  it("return next state for SETTING_SHOW_ERROR", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SHOW_ERROR,
      error: "bad value",
    };
    const state = settingReducer(undefined, action);
    expect(state.error).toEqual("bad value");
  });

  it("return next state for SETTING_SWITCH_TO_FORM", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SWITCH_TO_FORM,
      form: {},
    };
    const state = settingReducer(undefined, action);
    expect(state.form).toEqual({});
    expect(state.source).toEqual("form");
  });

  it("return next state for SETTING_SWITCH_TO_JSON", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SWITCH_TO_TEXT,
      text: "{}",
    };
    const state = settingReducer(undefined, action);
    expect(state.text).toEqual("{}");
    expect(state.source).toEqual(SettingsSource.Text);
  });
});
