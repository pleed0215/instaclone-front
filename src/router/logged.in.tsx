import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { NotFoundPage } from "../pages/404";
import { HomePage } from "../pages/home";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

export const LoggedInRouter = () => {
  return (
    <Router>
      <Header />
      <Container>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};
