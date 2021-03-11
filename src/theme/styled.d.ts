import "styled-components";
// 참고: https://flowkater.io/frontend/setup-styled-components/
declare module "styled-components" {
  export interface DefaultTheme {
    color: {
      primary: string;
      secondary: string;
      error?: string;
      warning?: string;
      info?: string;
      success?: string;
    };
    background: {
      primary: string;
      secondary: string;
    };
  }
}
