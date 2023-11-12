import React from "react";
import styled from "styled-components";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-coy.css";

const Container = styled.div`
  width: 100%;
  height: 100%;
  resize: both;
  overflow: auto;
  border: ButtonBorder 1px solid;
  border-radius: 4px;
  &:focus-within {
    box-shadow: inset 0 0 3px AccentColor;
  }
`;

const Content = styled.div`
  margin: 8px;
  position: relative;
  overflow: hidden;
`;

const StyledPre = styled.pre`
  position: absolute;
  font-size: 14px;
  width: 100%;
  height: 100%;
  resize: none;
  margin: 0;
  padding: 0;
`;

const StyledTextarea = styled.textarea`
  position: absolute;
  font-size: 14px;
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

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea: React.FC<Props> = (props) => {
  const highlightContainer = React.useRef<HTMLDivElement>(null);
  const container = React.useRef<HTMLDivElement>(null);
  const content = React.useRef<HTMLDivElement>(null);
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
    [],
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
    if (!textarea.current || !content.current) {
      return;
    }

    // shrink scroll area to get the correct scroll area
    content.current.style.width = "0";
    content.current.style.height = "0";

    const { scrollHeight, scrollWidth } = textarea.current;
    content.current.style.width = `${scrollWidth}px`;
    content.current.style.height = `${scrollHeight}px`;
  }, []);

  return (
    <Container ref={container}>
      <Content ref={content}>
        <StyledPre>
          <code ref={highlightContainer} />
        </StyledPre>
        <StyledTextarea
          {...props}
          wrap="off"
          ref={textarea}
          onChange={onChange}
          spellCheck={false}
          value={json}
        />
      </Content>
    </Container>
  );
};

export default TextArea;
