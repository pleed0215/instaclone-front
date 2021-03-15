import { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
  color: {
    primary: "black",
    secondary: "#880e4f",
    border: "rgb(219,219,219)",
    link: "#0095f6",
  },
  background: {
    primary: "#fff",
    secondary: "#f8e9f1",
  },
};
export const darkTheme: DefaultTheme = {
  color: {
    primary: "#eee",
    secondary: "#880e4f",
    border: "rgb(219,219,219)",
    link: "#0095f6",
  },
  background: {
    primary: "#333",
    secondary: "#c5b7be",
  },
};

// W3School.com 기준 5단계 breakpoint
export const breakpoints = {
  xs: "480px",
  sm: "600px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
};

// https://jsramblings.com/how-to-use-media-queries-with-styled-components/
export const device = {
  xs: `(max-width: ${breakpoints.sm})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
};
