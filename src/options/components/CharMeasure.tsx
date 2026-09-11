import React from "react";
import styles from "./CharMeasure.module.css";

export interface CharSize {
  width: number;
  height: number;
}

interface CharMeasureProps {
  onMeasure: (size: CharSize) => void;
}

export const CharMeasure: React.FC<CharMeasureProps> = ({ onMeasure }) => {
  const measureRef = React.useRef<HTMLSpanElement>(null);

  React.useLayoutEffect(() => {
    if (measureRef.current) {
      const rect = measureRef.current.getBoundingClientRect();
      onMeasure({ width: rect.width, height: rect.height });
    }
  }, [onMeasure]);

  return (
    <span ref={measureRef} className={styles.measure}>
      @
    </span>
  );
};
