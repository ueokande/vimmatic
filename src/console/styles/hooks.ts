import React from "react";
import { UpdateStyleContext } from "./contexts";
import SettingClient from "../clients/SettingClient";
import { newSender } from "../clients/BackgroundMessageSender";

const settingClient = new SettingClient(newSender());

export const useInvalidateStyle = () => {
  const update = React.useContext(UpdateStyleContext);
  const refresh = React.useCallback(async () => {
    const colorscheme = await settingClient.getColorScheme();
    const css = await settingClient.getConsoleStyle();
    update({ colorscheme, css });
  }, []);

  return refresh;
};
