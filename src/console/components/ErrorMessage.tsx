import React from "react";
import stylex from "@stylexjs/stylex";
import { useAutoResize } from "../hooks/useAutoResize";
import { colors } from "../styles/tokens.stylex";

const styles = stylex.create({
  error: {
    borderTop: "1px solid gray",
    backgroundColor: colors.errorBackground,
    color: colors.errorForeground,
    fontWeight: "bold",
  },
});

type Props = {
  children: React.ReactNode;
};

export const ErrorMessage: React.FC<Props> = ({ children }) => {
  useAutoResize();

  return (
    <p role="alert" {...stylex.props(styles.error)}>
      {children}
    </p>
  );
};
