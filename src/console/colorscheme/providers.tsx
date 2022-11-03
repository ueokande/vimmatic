import React from "react";
import { DarkTheme, LightTheme } from "./theme";
import { ColorSchemeContext, ColorSchemeUpdateContext } from "./contexts";
import { ThemeProvider } from "styled-components";

export const ColorSchemeProvider: React.FC = ({ children }) => {
  const [colorscheme, setColorScheme] = React.useState("system");
  const theme = React.useMemo(() => {
    if (colorscheme === "system") {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return DarkTheme;
      }
    } else if (colorscheme === "dark") {
      return DarkTheme;
    }
    return LightTheme;
  }, [colorscheme]);

  return (
    <ColorSchemeContext.Provider value={colorscheme}>
      <ColorSchemeUpdateContext.Provider value={setColorScheme}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ColorSchemeUpdateContext.Provider>
    </ColorSchemeContext.Provider>
  );
};
export default ColorSchemeProvider;
