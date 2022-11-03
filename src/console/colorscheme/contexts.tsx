import React from "react";

export const ColorSchemeContext = React.createContext<string>("system");

export const ColorSchemeUpdateContext = React.createContext<
  (colorscheme: string) => void
>(() => {});
