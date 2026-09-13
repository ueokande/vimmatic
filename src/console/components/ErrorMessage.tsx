import type React from "react";
import { useAutoResize } from "../hooks/useAutoResize";
import styles from "./ErrorMessage.module.css";

type Props = {
  children: React.ReactNode;
};

export const ErrorMessage: React.FC<Props> = ({ children }) => {
  useAutoResize();

  return (
    <p role="alert" className={styles.error}>
      {children}
    </p>
  );
};
