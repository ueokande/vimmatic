import React from "react";

export type Style = {
  colorscheme: string;
  css: Record<string, string>;
};

export const UpdateStyleContext = React.createContext<(style: Style) => void>(
  () => {},
);
