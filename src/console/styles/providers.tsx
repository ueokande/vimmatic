import React from "react";
import { UserPreferenceCSSProvider } from "./userPreferenceCSS";
import { ColorSchemeProvider } from "./colorScheme";

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
