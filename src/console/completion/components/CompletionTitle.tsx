import React from "react";
import styled from "styled-components";

const Li = styled.li<{ $shown: number }>`
  display: ${({ $shown }) => ($shown ? "block" : "none")};
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

const CompletionTitle: React.FC<Props> = ({ shown, title, ...props }) => (
  <Li $shown={Number(shown)} {...props}>
    {title}
  </Li>
);

export default CompletionTitle;
