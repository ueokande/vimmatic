import React from "react";
import useAutoResize from "../hooks/useAutoResize";
import stylex from "@stylexjs/stylex";
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

const InfoMessage: React.FC<Props> = ({ children }) => {
  useAutoResize();

  return <p {...stylex.props(styles.info)}>{children}</p>;
};

export default InfoMessage;
