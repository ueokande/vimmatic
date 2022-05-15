import React from "react";
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

interface Props {
  prompt: string;
  value: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<Props> = (props) => {
  const input = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    input?.current?.focus();
  }, []);

  return (
    <Container>
      <Prompt>{props.prompt}</Prompt>
      <InputInner
        ref={input}
        onBlur={props.onBlur}
        onKeyDown={props.onKeyDown}
        onChange={props.onChange}
        value={props.value}
      />
    </Container>
  );
};

export default Input;
