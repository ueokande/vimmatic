import React, { InputHTMLAttributes } from "react";
import styled from "../colorscheme/styled";

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
  ref: React.Ref<HTMLInputElement>
) {
  return (
    <Container>
      <Prompt>{props.prefix}</Prompt>
      <InputInner ref={ref} {...props} />
    </Container>
  );
});

export default PromptInput;
