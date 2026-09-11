import type React from "react";
import { ColorSchemeProvider } from "./colorScheme";
import { UserPreferenceCSSProvider } from "./userPreferenceCSS";

type Props = {
  children: React.ReactNode;
};

export const StyleProvider: React.FC<Props> = ({ children }) => {
  return (
    <UserPreferenceCSSProvider>
      <ColorSchemeProvider>{children}</ColorSchemeProvider>
    </UserPreferenceCSSProvider>
  );
};
