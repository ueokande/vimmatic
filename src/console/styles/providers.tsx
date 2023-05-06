import React from "react";
import { DarkTheme, LightTheme } from "./theme";
import { Style, UpdateStyleContext } from "./contexts";
import GlobalStyle from "./global";
import { ThemeProvider } from "styled-components";

export const StyleProvider: React.FC = ({ children }) => {
  const [style, setStyle] = React.useState<Style>({
    colorscheme: "system",
    css: {},
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
      <GlobalStyle {...style.css} />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </UpdateStyleContext.Provider>
  );
};
export default StyleProvider;
