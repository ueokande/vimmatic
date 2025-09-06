import React from "react";
import stylex from "@stylexjs/stylex";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-coy.css";
import { CharMeasure, type CharSize } from "./CharMeasure";

const styles = stylex.create({
  container: {
    display: "block",
    width: "stretch",
    border: "ButtonBorder 1px solid",
    borderRadius: "4px",
    overflow: "hidden",
    ":focus-within": {
      boxShadow: "inset 0 0 3px AccentColor",
    },
  },
  wrapper: {
    display: "grid",
    gridTemplateAreas: '"content"',
    padding: "8px",
    fontFamily: "monospace",
    fontSize: "14px",
    lineHeight: "1.5",
    overflow: "hidden",
  },
  highlightLayer: {
    gridArea: "content",
    margin: 0,
    padding: 0,
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    whiteSpace: "pre",
    overflow: "visible",
    pointerEvents: "none",
  },
  textarea: {
    gridArea: "content",
    padding: 0,
    margin: 0,
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    border: "none",
    outline: "none",
    resize: "none",
    backgroundColor: "transparent",
    color: "transparent",
    caretColor: "CanvasText",
    whiteSpace: "pre",
    overflow: "hidden",
  },
});

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea: React.FC<Props> = ({
  onChange,
  value,
  ...restProps
}) => {
  const [content, setContent] = React.useState((value as string) || "");
  const [highlightedHtml, setHighlightedHtml] = React.useState("");
  const [charSize, setCharSize] = React.useState<CharSize>({
    width: 0,
    height: 0,
  });
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const handleCharMeasure = React.useCallback((size: CharSize) => {
    setCharSize(size);
  }, []);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setContent(newValue);
      onChange?.(e);
    },
    [onChange],
  );

  React.useEffect(() => {
    if (value !== undefined && value !== content) {
      setContent(value as string);
    }
  }, [value]);

  React.useEffect(() => {
    const highlighted = Prism.highlight(content, Prism.languages.json, "json");
    setHighlightedHtml(highlighted);
  }, [content]);

  const dimensions = React.useMemo(() => {
    const lines = content.split("\n");
    const rows = Math.max(lines.length, 1);
    const cols = Math.max(...lines.map((line) => line.length), 80);
    return { rows, cols };
  }, [content]);

  React.useLayoutEffect(() => {
    if (wrapperRef.current && charSize.width > 0 && charSize.height > 0) {
      const contentWidth = dimensions.cols * charSize.width - 32; // -32 for padding
      const contentHeight = dimensions.rows * charSize.height - 32; // -32 for padding

      const currentWidth = wrapperRef.current.style.width;
      const currentHeight = wrapperRef.current.style.height;
      const newWidth = `${contentWidth}px`;
      const newHeight = `${contentHeight}px`;

      if (currentWidth !== newWidth) {
        wrapperRef.current.style.width = newWidth;
      }
      if (currentHeight !== newHeight) {
        wrapperRef.current.style.height = newHeight;
      }
    }
  }, [dimensions, charSize]);

  return (
    <div {...stylex.props(styles.container)}>
      <div ref={wrapperRef} {...stylex.props(styles.wrapper)}>
        <pre
          {...stylex.props(styles.highlightLayer)}
          dangerouslySetInnerHTML={{ __html: highlightedHtml || "&nbsp;" }}
          aria-hidden="true"
        />
        <textarea
          {...restProps}
          {...stylex.props(styles.textarea)}
          value={content}
          onChange={handleChange}
          spellCheck={false}
          autoComplete="off"
          wrap="off"
        />
        <CharMeasure onMeasure={handleCharMeasure} />
      </div>
    </div>
  );
};
