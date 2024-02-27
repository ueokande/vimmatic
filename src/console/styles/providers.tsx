import React from "react";
import { DarkTheme, LightTheme } from "./theme";
import { type Style, UpdateStyleContext } from "./contexts";
import { ThemeProvider } from "styled-components";
import { UserPreferenceCSSProvider } from "./userPreferenceCSS";

type Props = {
  children: React.ReactNode;
};

export const StyleProvider: React.FC<Props> = ({ children }) => {
  const [style, setStyle] = React.useState<Style>({
    colorscheme: "system",
  });
  const theme = React.useMemo(() => {
    if (style.colorscheme === "system") {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return DarkTheme;
      }
    } else if (style.colorscheme === "dark") {
      return DarkTheme;
    }
    return LightTheme;
  }, [style.colorscheme]);

  return (
    <UpdateStyleContext.Provider value={setStyle}>
      <UserPreferenceCSSProvider>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </UserPreferenceCSSProvider>
    </UpdateStyleContext.Provider>
  );
};
export default StyleProvider;
