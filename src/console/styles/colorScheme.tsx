import React from "react";
import { newSender } from "../clients/BackgroundMessageSender";
import { SettingClient } from "../clients/SettingClient";
import styles from "./theme.module.css";

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
  const themeClassName = React.useMemo(() => {
    if (userColorScheme === "system") {
      if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        return styles.dark;
      }
    } else if (userColorScheme === "dark") {
      return styles.dark;
    }
    return styles.light;
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
      {ready ? <div className={themeClassName}>{children}</div> : null}
    </ColorSchemeContext.Provider>
  );
};
