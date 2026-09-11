import React from "react";
import { newSender } from "../clients/BackgroundMessageSender";
import { SettingClient } from "../clients/SettingClient";

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

  // The user-configured font is only known at runtime, so it cannot be
  // expressed as a CSS Module class; it's applied as an inline style here.
  const userPreferenceStyle: React.CSSProperties = {
    font: css.font,
    fontFamily: css["font-family"],
    fontSize: css["font-size"],
    fontStyle: css["font-style"],
  };

  return (
    <UserPreferenceCSSContext.Provider value={{ ready, css }}>
      {ready ? <div style={userPreferenceStyle}>{children}</div> : null}
    </UserPreferenceCSSContext.Provider>
  );
};

export const useUserPreferenceCSS = () =>
  React.useContext(UserPreferenceCSSContext);
