import React from "react";
import styled from "styled-components";

const ErrorMessageP = styled.p`
  font-weight: bold;
  color: red;
  min-height: 1.5em;
`;

interface Props {
  error?: Error;
}

const ErrorMessage: React.FC<Props> = ({ error }) => {
  if (typeof error === "undefined") {
    return null;
  }
  return <ErrorMessageP role="alert">{error.message}</ErrorMessageP>;
};

export default ErrorMessage;
