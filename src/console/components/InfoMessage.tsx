import React from "react";
import styled from "styled-components";
import useAutoResize from "../hooks/useAutoResize";

const Wrapper = styled.p`
  border-top: 1px solid gray;
  background-color: ${({ theme }) => theme.info?.background};
  color: ${({ theme }) => theme.info?.foreground};
  font-weight: normal;
  white-space: pre-wrap;
`;

type Props = {
  children: React.ReactNode;
};

const InfoMessage: React.FC<Props> = ({ children }) => {
  useAutoResize();

  return <Wrapper role="status">{children}</Wrapper>;
};

export default InfoMessage;
