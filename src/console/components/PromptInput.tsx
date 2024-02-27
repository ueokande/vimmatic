import React, { type InputHTMLAttributes } from "react";
import stylex from "@stylexjs/stylex";
import styled from "styled-components";
import { useUserPreferenceCSS } from "../styles/userPreferenceCSS";

const styles = stylex.create({
  userPreference: (css: Record<string, string>) => ({
    fontFamily: css["font-family"],
    fontSize: css["font-size"],
    fontStyle: css["font-style"],
  }),
});

const Container = styled.div`
  background-color: ${({ theme }) => theme.command.background};
  color: ${({ theme }) => theme.command.foreground};
  display: flex;
`;

const Prompt = styled.i`
  font-style: normal;
`;

const InputInner = styled.input`
  border: none;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.command.background};
  color: ${({ theme }) => theme.command.foreground};
`;

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  prefix: string;
}

const PromptInput: React.FC<Props> = React.forwardRef(function PromptInput(
  props,
  ref: React.Ref<HTMLInputElement>,
) {
  const { css } = useUserPreferenceCSS();

  return (
    <Container>
      <Prompt>{props.prefix}</Prompt>
      <InputInner
        ref={ref}
        {...stylex.props(styles.userPreference(css))}
        {...props}
      />
    </Container>
  );
});

export default PromptInput;
