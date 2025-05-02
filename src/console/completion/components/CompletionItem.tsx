import React from "react";
import * as stylex from "@stylexjs/stylex";
import { colors } from "../../styles/tokens.stylex";

const styles = stylex.create({
  base: {
    backgroundColor: colors.background,
    color: colors.foreground,
    paddingLeft: "1.8rem",
    backgroundPosition: "0 center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    whiteSpace: "pre",
  },
  icon: (icon: string | undefined) => ({
    backgroundImage: typeof icon !== "undefined" ? `url(${icon})` : "unset",
  }),
  highlighted: {
    backgroundColor: colors.selectBackground,
    color: colors.selectForeground,
  },
  shown: {
    display: "block",
  },
  hidden: {
    display: "none",
  },

  primaryText: {
    display: "inline-block",
    width: "40%",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  secondaryText: {
    display: "inline-block",
    color: colors.secondaryForeground,
    width: "60%",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
});

interface Props extends React.HTMLAttributes<HTMLElement> {
  shown: boolean;
  highlight: boolean;
  primary?: string;
  secondary?: string;
  icon?: string;
}

export const CompletionItem: React.FC<Props> = ({
  shown,
  highlight,
  primary,
  secondary,
  icon,
  ...props
}) => (
  <div
    aria-labelledby={`completion-item-${primary}`}
    {...stylex.props(
      styles.base,
      styles.icon(icon),
      shown ? styles.shown : styles.hidden,
      highlight ? styles.highlighted : null,
    )}
    {...props}
  >
    <span
      id={`completion-item-${primary}`}
      {...stylex.props(styles.primaryText)}
    >
      {primary}
    </span>
    <span {...stylex.props(styles.secondaryText)}>{secondary}</span>
  </div>
);
