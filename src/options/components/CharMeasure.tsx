import React from "react";
import stylex from "@stylexjs/stylex";

const styles = stylex.create({
  measure: {
    position: "absolute",
    visibility: "hidden",
    height: "auto",
    width: "auto",
    whiteSpace: "pre",
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    pointerEvents: "none",
  },
});

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
    <span ref={measureRef} {...stylex.props(styles.measure)}>
      @
    </span>
  );
};
