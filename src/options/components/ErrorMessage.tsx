import type React from "react";
import stylex from "@stylexjs/stylex";

const styles = stylex.create({
  error: {
    fontWeight: "bold",
    color: "red",
    minHeight: "1.5em",
  },
});

interface Props {
  error?: Error;
}

export const ErrorMessage: React.FC<Props> = ({ error }) => {
  if (typeof error === "undefined") {
    return null;
  }
  return (
    <p {...stylex.props(styles.error)} role="alert">
      {error.message}
    </p>
  );
};
