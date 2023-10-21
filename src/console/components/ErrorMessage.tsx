import React from "react";
import styled from "styled-components";
import useAutoResize from "../hooks/useAutoResize";

const Wrapper = styled.p`
  border-top: 1px solid gray;
  background-color: ${({ theme }) => theme.error?.background};
  color: ${({ theme }) => theme.error?.foreground};
  font-weight: bold;
`;

type Props = {
  children: React.ReactNode;
};

const ErrorMessage: React.FC<Props> = ({ children }) => {
  useAutoResize();

  return <Wrapper role="alert">{children}</Wrapper>;
};

export default ErrorMessage;
