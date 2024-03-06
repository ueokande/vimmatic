import React, { type InputHTMLAttributes } from "react";
import stylex from "@stylexjs/stylex";
import { colors } from "../styles/tokens.stylex";
import { useUserPreferenceCSS } from "../styles/userPreferenceCSS";

const styles = stylex.create({
  container: {
    backgroundColor: colors.commandBackground,
    color: colors.commandForeground,
    display: "flex",
  },
  prompt: {
    fontStyle: "normal",
  },
  input: {
    border: "none",
    flexGrow: 1,
    backgroundColor: colors.commandBackground,
    color: colors.commandForeground,
  },
  userPreference: (css: Record<string, string>) => ({
    fontFamily: css["font-family"],
    fontSize: css["font-size"],
    fontStyle: css["font-style"],
  }),
});

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  prefix: string;
}

const PromptInput: React.FC<Props> = React.forwardRef(function PromptInput(
  props,
  ref: React.Ref<HTMLInputElement>,
) {
  const { css } = useUserPreferenceCSS();
  return (
    <div {...stylex.props(styles.container)}>
      <i {...stylex.props(styles.prompt)}>{props.prefix}</i>
      <input
        {...stylex.props(styles.input, styles.userPreference(css))}
        {...props}
        ref={ref}
      />
    </div>
  );
});

export default PromptInput;
