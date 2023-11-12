import React from "react";
import styled from "styled-components";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-coy.css";

const Container = styled.div`
  width: 100%;
  height: 100%;
  resize: none;
  overflow: auto;
  border: ButtonBorder 1px solid;
  border-radius: 4px;
  &:focus-within {
    box-shadow: inset 0 0 3px AccentColor;
  }
`;

const Content = styled.div`
  margin: 8px;
  font: 14px monospace;
  position: relative;
  overflow: hidden;
`;

const StyledPre = styled.pre`
  position: absolute;
  font: inherit;
  width: 100%;
  height: 100%;
  resize: none;
  margin: 0;
  padding: 0;
`;

const StyledTextarea = styled.textarea`
  position: absolute;
  overflow: hidden;
  font: inherit;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  outline: none;
  border: none;
  resize: none;
  background-color: transparent;
  color: transparent;
  caret-color: CanvasText;
`;

const TextMeasure = styled.div`
  font: inherit;
  position: absolute;
  visibility: hidden;
`;

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
    <Container ref={container}>
      <Content ref={content}>
        <StyledPre>
          <code ref={highlightContainer} />
        </StyledPre>
        <StyledTextarea
          {...props}
          wrap="off"
          cols={cols}
          rows={rows}
          ref={textarea}
          onChange={onChange}
          spellCheck={false}
          value={json}
        />
        <TextMeasure ref={measure}>@</TextMeasure>
      </Content>
    </Container>
  );
};

export default TextArea;
