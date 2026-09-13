import type React from "react";
import styles from "./CompletionItem.module.css";

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
  <li
    role="menuitem"
    aria-labelledby={`completion-item-${primary}`}
    aria-current={highlight}
    aria-hidden={!shown}
    className={[
      styles.base,
      shown ? styles.shown : styles.hidden,
      highlight ? styles.highlighted : null,
    ]
      .filter(Boolean)
      .join(" ")}
    // The icon path is only known at runtime (per completion item), so it
    // cannot be expressed as a CSS Module class; it's applied inline here.
    style={{
      backgroundImage: typeof icon !== "undefined" ? `url(${icon})` : "unset",
    }}
    {...props}
  >
    <span id={`completion-item-${primary}`} className={styles.primaryText}>
      {primary}
    </span>
    <span className={styles.secondaryText}>{secondary}</span>
  </li>
);
