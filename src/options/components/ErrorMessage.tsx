import type React from "react";
import styles from "./ErrorMessage.module.css";

interface Props {
  error?: Error;
}

export const ErrorMessage: React.FC<Props> = ({ error }) => {
  if (typeof error === "undefined") {
    return null;
  }
  return (
    <p className={styles.error} role="alert">
      {error.message}
    </p>
  );
};
