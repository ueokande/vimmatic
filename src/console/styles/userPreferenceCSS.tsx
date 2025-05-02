import React from "react";
import * as stylex from "@stylexjs/stylex";
import { SettingClient } from "../clients/SettingClient";
import { newSender } from "../clients/BackgroundMessageSender";

const settingClient = new SettingClient(newSender());

type CSS = Record<string, string>;
type ContextState = {
  ready: boolean;
  css: CSS;
};

const UserPreferenceCSSContext = React.createContext<ContextState>({
  ready: false,
  css: {},
});

const styles = stylex.create({
  userPreference: (css: Record<string, string>) => ({
    font: css["font"],
    fontFamily: css["font-family"],
    fontSize: css["font-size"],
    fontStyle: css["font-style"],
  }),
});

export const UserPreferenceCSSProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ready, setReady] = React.useState(false);
  const [css, setCSS] = React.useState<CSS>({});

  React.useEffect(() => {
    (async () => {
      const css = await settingClient.getConsoleStyle();
      setCSS(css);
      setReady(true);
    })();
  }, []);

  return (
    <UserPreferenceCSSContext.Provider value={{ ready, css }}>
      {ready ? (
        <div {...stylex.props(styles.userPreference(css))}>{children}</div>
      ) : null}
    </UserPreferenceCSSContext.Provider>
  );
};

export const useUserPreferenceCSS = () =>
  React.useContext(UserPreferenceCSSContext);
