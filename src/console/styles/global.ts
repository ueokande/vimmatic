import { createGlobalStyle, css } from "styled-components";
import type { CSSObject } from "styled-components";

const GlobalStyle = createGlobalStyle<CSSObject>`
  html, body, * {
    margin: 0;
    padding: 0;
  }

  body {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }

  * {
    ${(obj) => css(obj)}
  }
`;

export default GlobalStyle;
