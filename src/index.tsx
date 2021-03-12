import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";

import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Container>
        <App />
      </Container>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
