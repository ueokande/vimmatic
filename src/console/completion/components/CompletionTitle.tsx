import React from "react";
import stylex from "@stylexjs/stylex";
import { colors } from "../../styles/tokens.stylex";

const styles = stylex.create({
  shown: {
    display: "block",
  },
  hidden: {
    display: "none",
  },
  title: {
    backgroundColor: colors.titleBackground,
    color: colors.titleForeground,
    listStyle: "none",
    fontWeight: "bold",
    margin: 0,
    padding: 0,
  },
});

interface Props extends React.HTMLAttributes<HTMLElement> {
  shown: boolean;
  title: string;
}

export const CompletionTitle: React.FC<Props> = ({
  shown,
  title,
  ...props
}) => (
  <li
    {...stylex.props(styles.title, shown ? styles.shown : styles.hidden)}
    {...props}
  >
    {title}
  </li>
);
