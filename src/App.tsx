import { useReactiveVar } from "@apollo/client";
import React from "react";
import { ThemeProvider } from "styled-components";
import { darkModeVar, isLoggedInVar } from "./apollo/vars";
import { GlobalStyles } from "./components/GlobalStyles";

import { LoggedInRouter } from "./router/logged.in";
import { LoggedOutRouter } from "./router/logged.out";
import { darkTheme, lightTheme } from "./theme/theme";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDarkMode = useReactiveVar(darkModeVar);
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      {isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />}
    </ThemeProvider>
  );
}

export default App;
