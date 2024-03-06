import React from "react";
import stylex from "@stylexjs/stylex";
import SettingClient from "../clients/SettingClient";
import { newSender } from "../clients/BackgroundMessageSender";
import { lightTheme, darkTheme } from "./themes";

const settingClient = new SettingClient(newSender());

type ContextState = {
  ready: boolean;
};

const ColorSchemeContext = React.createContext<ContextState>({
  ready: false,
});

export const ColorSchemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ready, setReady] = React.useState(false);
  const [userColorScheme, setUserColorScheme] = React.useState("system");
  const theme = React.useMemo(() => {
    if (userColorScheme === "system") {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return darkTheme;
      }
    } else if (userColorScheme === "dark") {
      return darkTheme;
    }
    return lightTheme;
  }, [userColorScheme]);

  React.useEffect(() => {
    (async () => {
      setReady(false);
      const prop = await settingClient.getColorScheme();
      setUserColorScheme(prop);
      setReady(true);
    })();
  }, []);

  return (
    <ColorSchemeContext.Provider value={{ ready }}>
      {ready ? <div {...stylex.props(theme)}>{children}</div> : null}
    </ColorSchemeContext.Provider>
  );
};
