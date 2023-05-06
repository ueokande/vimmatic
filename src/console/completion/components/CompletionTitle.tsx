import React from "react";
import styled from "../../styles/styled";

const Li = styled.li<{ shown: boolean }>`
  display: ${({ shown }) => (shown ? "display" : "none")};
  background-color: ${({ theme }) => theme.title?.background};
  color: ${({ theme }) => theme.title?.foreground};
  list-style: none;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

interface Props extends React.HTMLAttributes<HTMLElement> {
  shown: boolean;
  title: string;
}

const CompletionTitle: React.FC<Props> = (props) => (
  <Li {...props}>{props.title}</Li>
);

export default CompletionTitle;
