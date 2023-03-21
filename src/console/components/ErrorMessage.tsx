import React from "react";
import styled from "../colorscheme/styled";
import useAutoResize from "../hooks/useAutoResize";

const Wrapper = styled.p`
  border-top: 1px solid gray;
  background-color: ${({ theme }) => theme.consoleErrorBackground};
  color: ${({ theme }) => theme.consoleErrorForeground};
  font-weight: bold;
`;

const ErrorMessage: React.FC = ({ children }) => {
  useAutoResize();

  return <Wrapper role="alert">{children}</Wrapper>;
};

export default ErrorMessage;
