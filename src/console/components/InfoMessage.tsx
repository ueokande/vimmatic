import React from "react";
import * as stylex from "@stylexjs/stylex";
import { useAutoResize } from "../hooks/useAutoResize";
import { colors } from "../styles/tokens.stylex";

const styles = stylex.create({
  info: {
    borderTop: "1px solid gray",
    backgroundColor: colors.infoBackground,
    color: colors.infoForeground,
    fontWeight: "normal",
    whiteSpace: "pre-wrap",
  },
});

type Props = {
  children: React.ReactNode;
};

export const InfoMessage: React.FC<Props> = ({ children }) => {
  useAutoResize();

  return (
    <p role="status" {...stylex.props(styles.info)}>
      {children}
    </p>
  );
};
