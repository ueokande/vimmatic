import React from "react";
import styled from "styled-components";

const Container = styled.li<{
  $shown: number;
  $icon?: string;
  $highlight: number;
}>`
  background-image: ${({ $icon }) =>
    typeof $icon !== "undefined" ? "url(" + $icon + ")" : "unset"};
  background-color: ${({ $highlight, theme }) =>
    $highlight ? theme.select?.background : theme.background};
  color: ${({ $highlight, theme }) =>
    $highlight ? theme.select?.foreground : theme.foreground};
  display: ${({ $shown }) => ($shown ? "block" : "none")};
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

const CompletionItem: React.FC<Props> = ({
  shown,
  highlight,
  primary,
  secondary,
  icon,
  ...props
}) => (
  <Container
    aria-labelledby={`completion-item-${primary}`}
    $shown={Number(shown)}
    $icon={icon}
    $highlight={Number(highlight)}
    {...props}
  >
    <Primary id={`completion-item-${primary}`}>{primary}</Primary>
    <Secondary>{secondary}</Secondary>
  </Container>
);

export default CompletionItem;
