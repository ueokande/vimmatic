import type { InputHTMLAttributes } from "react";
import React from "react";
import { useUserPreferenceCSS } from "../styles/userPreferenceCSS";
import styles from "./PromptInput.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  prefix: string;
}

export const PromptInput: React.FC<Props> = React.forwardRef(
  function PromptInput(props, ref: React.Ref<HTMLInputElement>) {
    const { css } = useUserPreferenceCSS();
    // The user-configured font is only known at runtime, so it cannot be
    // expressed as a CSS Module class; it's applied as an inline style here.
    const userPreferenceStyle: React.CSSProperties = {
      fontFamily: css["font-family"],
      fontSize: css["font-size"],
      fontStyle: css["font-style"],
    };
    return (
      <div className={styles.container}>
        <i className={styles.prompt}>{props.prefix}</i>
        <input
          className={styles.input}
          style={userPreferenceStyle}
          {...props}
          ref={ref}
        />
      </div>
    );
  },
);
