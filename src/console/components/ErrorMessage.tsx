import React from "react";
import useAutoResize from "../hooks/useAutoResize";
import stylex from "@stylexjs/stylex";
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

const ErrorMessage: React.FC<Props> = ({ children }) => {
  useAutoResize();

  return (
    <p role="alert" {...stylex.props(styles.error)}>
      {children}
    </p>
  );
};

export default ErrorMessage;
