import type React from "react";
import { useAutoResize } from "../hooks/useAutoResize";
import styles from "./InfoMessage.module.css";

type Props = {
  children: React.ReactNode;
};

export const InfoMessage: React.FC<Props> = ({ children }) => {
  useAutoResize();

  return (
    <p role="status" className={styles.info}>
      {children}
    </p>
  );
};
