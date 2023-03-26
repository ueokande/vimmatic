import React, { InputHTMLAttributes } from "react";
import styled from "../../colorscheme/styled";

const Container = styled.div`
  background-color: ${({ theme }) => theme.commandBackground};
  color: ${({ theme }) => theme.commandForeground};
  display: flex;
`;

const Prompt = styled.i`
  font-style: normal;
`;

const InputInner = styled.input`
  border: none;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.commandBackground};
  color: ${({ theme }) => theme.commandForeground};
`;

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  prompt: string;
}

const Input: React.FC<Props> = (props) => {
  const input = React.useRef<HTMLInputElement>(null);

  return (
    <Container>
      <Prompt>{props.prompt}</Prompt>
      <InputInner ref={input} {...props} />
    </Container>
  );
};

export default Input;
