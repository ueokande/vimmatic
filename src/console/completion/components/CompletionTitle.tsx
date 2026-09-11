import type React from "react";
import styles from "./CompletionTitle.module.css";

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
    aria-hidden={!shown}
    className={`${styles.title} ${shown ? styles.shown : styles.hidden}`}
    {...props}
  >
    {title}
  </li>
);
