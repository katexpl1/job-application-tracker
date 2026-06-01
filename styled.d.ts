import type { Theme } from "blunt-ui";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
