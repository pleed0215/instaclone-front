import { ApolloProvider, useReactiveVar } from "@apollo/client";
import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { apolloClient } from "./apollo/client";
import { darkModeVar, isLoggedInVar } from "./apollo/vars";
import { GlobalStyles } from "./components/GlobalStyles";

import { LoggedInRouter } from "./router/logged.in";
import { LoggedOutRouter } from "./router/logged.out";
import { darkTheme, lightTheme } from "./theme/theme";

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.color.primary};
`;

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDarkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Container>
          <GlobalStyles />
          {isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />}
        </Container>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
