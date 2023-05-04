import React from "react";
import { ColorSchemeUpdateContext } from "./contexts";
import SettingClient from "../clients/SettingClient";
import { newSender } from "../clients/BackgroundMessageSender";

const settingClient = new SettingClient(newSender());

export const useColorSchemeRefresh = () => {
  const update = React.useContext(ColorSchemeUpdateContext);
  const refresh = React.useCallback(() => {
    settingClient.getColorScheme().then((newScheme) => {
      update(newScheme);
    });
  }, []);

  return refresh;
};
