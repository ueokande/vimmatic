import React from "react";
import styled from "../../colorscheme/styled";

const Container = styled.li<{
  shown: boolean;
  icon?: string;
  highlight: boolean;
}>`
  background-image: ${({ icon }) =>
    typeof icon !== "undefined" ? "url(" + icon + ")" : "unset"};
  background-color: ${({ highlight, theme }) =>
    highlight ? theme.select?.background : theme.background};
  color: ${({ highlight, theme }) =>
    highlight ? theme.select?.foreground : theme.foreground};
  display: ${({ shown }) => (shown ? "block" : "none")};
  padding-left: 1.8rem;
  background-position: 0 center;
  background-size: contain;
  background-repeat: no-repeat;
  white-space: pre;
`;

const Primary = styled.span`
  display: inline-block;
  width: 40%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Secondary = styled.span`
  display: inline-block;
  color: ${({ theme }) => theme.secondaryForeground};
  width: 60%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

interface Props extends React.HTMLAttributes<HTMLElement> {
  shown: boolean;
  highlight: boolean;
  primary?: string;
  secondary?: string;
  icon?: string;
}

const CompletionItem: React.FC<Props> = (props) => (
  <Container aria-labelledby={`completion-item-${props.primary}`} {...props}>
    <Primary id={`completion-item-${props.primary}`}>{props.primary}</Primary>
    <Secondary>{props.secondary}</Secondary>
  </Container>
);

export default CompletionItem;
