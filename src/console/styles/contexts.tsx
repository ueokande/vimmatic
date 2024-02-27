import React from "react";

export type Style = {
  colorscheme: string;
};

export const UpdateStyleContext = React.createContext<(style: Style) => void>(
  () => {},
);
