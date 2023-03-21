import React from "react";
import styled from "../colorscheme/styled";
import useAutoResize from "../hooks/useAutoResize";

const Wrapper = styled.p`
  border-top: 1px solid gray;
  background-color: ${({ theme }) => theme.consoleInfoBackground};
  color: ${({ theme }) => theme.consoleInfoForeground};
  font-weight: normal;
`;

const InfoMessage: React.FC = ({ children }) => {
  useAutoResize();

  return <Wrapper role="status">{children}</Wrapper>;
};

export default InfoMessage;
