import 'styled-components';
import { ThemeProperties } from "../src/console/styles/theme";

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeProperties {}
}
