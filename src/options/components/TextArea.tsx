import React from "react";
import styled from "styled-components";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-coy.css";

const padding = 4;

const Container = styled.div`
  position: relative;
  overflow: hidden;
  border: ButtonBorder 1px solid;
  border-radius: 4px;
  &:focus-within {
    box-shadow: inset 0 0 3px AccentColor;
  }
  padding: ${padding}px;
`;

const StyledPre = styled.pre`
  position: absolute;
  font-size: 14px;
  width: calc(100% - ${padding}px * 2);
  height: calc(100% - ${padding}px * 2);
  resize: none;
  margin: 0;
  padding: 0;
`;

const StyledTextarea = styled.textarea`
  position: absolute;
  font-size: 14px;
  width: calc(100% - ${padding}px * 2);
  height: calc(100% - ${padding}px * 2);
  padding: 0;
  margin: 0;
  outline: none;
  border: none;
  resize: none;
  background-color: transparent;
  color: transparent;
  caret-color: CanvasText;
`;

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea: React.FC<Props> = (props) => {
  const highlightContainer = React.useRef<HTMLDivElement>(null);
  const container = React.useRef<HTMLDivElement>(null);
  const textarea = React.useRef<HTMLTextAreaElement>(null);
  const [json, setJson] = React.useState(props.value as string);

  React.useEffect(() => {
    highlight(json);
  }, []);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setJson(e.target.value);
      highlight(e.target.value);
      autoResize();
      props.onChange?.(e);
    },
    []
  );

  const highlight = React.useCallback((source: string) => {
    if (!highlightContainer.current) {
      return;
    }

    const highlighted = Prism.highlight(source, Prism.languages.json, "json");
    highlightContainer.current.innerHTML = highlighted;
    autoResize();
  }, []);

  const autoResize = React.useCallback(() => {
    if (!textarea.current || !container.current) {
      return;
    }

    const { scrollHeight } = textarea.current;
    container.current.style.height = `${scrollHeight}px`;
  }, []);

  return (
    <Container ref={container}>
      <StyledPre>
        <code ref={highlightContainer} />
      </StyledPre>
      <StyledTextarea
        {...props}
        ref={textarea}
        onChange={onChange}
        spellCheck={false}
        value={json}
      />
    </Container>
  );
};

export default TextArea;
