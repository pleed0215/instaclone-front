import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyles = createGlobalStyle`
@font-face {
        font-family: 'Amarillo';
        font-style: normal;
        font-weight: 300;
        src: url('fonts/Amarillo.ttf') format('truetype'), 
             url('fonts/Amarillo.otf') format('opentype');
    }
    ${reset}
    a{
        text-decoration: none;
        color: inherit;
    }
    *{
        box-sizing: border-box;
        background-color:${(props) => props.theme.background.primary};
        color:${(props) => props.theme.color.primary};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 14px;
    }
`;