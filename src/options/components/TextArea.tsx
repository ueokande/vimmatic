import React from "react";
import stylex from "@stylexjs/stylex";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-coy.css";

const styles = stylex.create({
  container: {
    width: "100%",
    height: "100%",
    resize: "none",
    overflow: "auto",
    border: "ButtonBorder 1px solid",
    borderRadius: "4px",
    ":focus-within": {
      boxShadow: "inset 0 0 3px AccentColor",
    },
  },
  content: {
    margin: "8px",
    font: "14px monospace",
    position: "relative",
    overflow: "hidden",
  },
  pre: {
    position: "absolute",
    font: "inherit",
    width: "100%",
    height: "100%",
    resize: "none",
    margin: 0,
    padding: 0,
  },
  textarea: {
    position: "absolute",
    overflow: "hidden",
    font: "inherit",
    width: "100%",
    height: "100%",
    padding: 0,
    margin: 0,
    outline: "none",
    border: "none",
    resize: "none",
    backgroundColor: "transparent",
    color: "transparent",
    caretColor: "CanvasText",
  },
  textMeasure: {
    font: "inherit",
    position: "absolute",
    visibility: "hidden",
  },
});

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea: React.FC<Props> = (props) => {
  const highlightContainer = React.useRef<HTMLDivElement>(null);
  const container = React.useRef<HTMLDivElement>(null);
  const content = React.useRef<HTMLDivElement>(null);
  const textarea = React.useRef<HTMLTextAreaElement>(null);
  const measure = React.useRef<HTMLDivElement>(null);
  const [json, setJson] = React.useState(props.value as string);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setJson(e.target.value);
      props.onChange?.(e);
    },
    [],
  );

  const [charWidth, charHeight] = React.useMemo(() => {
    if (!measure.current) {
      return [0, 0];
    }
    const { width, height } = measure.current.getBoundingClientRect();
    return [width, height];
  }, [measure.current]);

  const [cols, rows] = React.useMemo(() => {
    const lines = json.split("\n");
    const cols = Math.max(...lines.map((line) => line.length));
    const rows = lines.length;
    return [cols, rows];
  }, [json]);

  const autoResize = React.useCallback(() => {
    if (!textarea.current || !content.current || !container.current) {
      return;
    }

    // resize textarea
    const parentWidth = container.current.getBoundingClientRect().width - 16;
    content.current.style.width = `${Math.max(
      parentWidth,
      charWidth * cols,
    )}px`;
    content.current.style.height = `${charHeight * rows}px`;
  }, [
    textarea.current,
    content.current,
    container.current,
    charWidth,
    charHeight,
    cols,
    rows,
  ]);

  React.useEffect(() => {
    if (!highlightContainer.current) {
      return;
    }
    const highlighted = Prism.highlight(json, Prism.languages.json, "json");
    highlightContainer.current.innerHTML = highlighted;
    autoResize();
  }, [json]);

  React.useEffect(() => {
    setJson(props.value as string);
  }, [props.value]);

  React.useEffect(() => {
    autoResize();
    window.addEventListener("resize", autoResize);
    return () => {
      window.removeEventListener("resize", autoResize);
    };
  }, [autoResize]);

  return (
    <div ref={container} {...stylex.props(styles.container)}>
      <div ref={content} {...stylex.props(styles.content)}>
        <pre {...stylex.props(styles.pre)}>
          <code ref={highlightContainer} />
        </pre>
        <textarea
          {...props}
          {...stylex.props(styles.textarea)}
          wrap="off"
          cols={cols}
          rows={rows}
          ref={textarea}
          onChange={onChange}
          spellCheck={false}
          value={json}
        />
        {/* initialize with a single character to measure the size of the font */}
        <div ref={measure} {...stylex.props(styles.textMeasure)}>
          @
        </div>
      </div>
    </div>
  );
};

export default TextArea;
