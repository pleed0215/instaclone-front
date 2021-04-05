import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import { Header } from "../components/Header";
import { NotFoundPage } from "../pages/404";
import { ProfileEditPage } from "../pages/edit.profile";
import { HomePage } from "../pages/home";
import { SearchPage } from "../pages/search";
import { UserPage } from "../pages/user";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 6rem;
  margin-bottom: 3rem;
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
          <Route path="/edit-me" exact>
            <ProfileEditPage />
          </Route>
          <Route path="/search" exact>
            <SearchPage />
          </Route>
          <Route path="/users/:username" exact>
            <UserPage />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};
