import { gql } from "@apollo/client";
import React from "react";
import styled from "styled-components";
import { darkModeVar } from "../../apollo/vars";

const GQL_CREATE_ACCOUNT = gql`
  mutation MutationCreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

const GQL_LOGIN = gql`
  mutation MutationLogin($input: LoginInput!) {
    login(input: $input) {
      ok
      error
    }
  }
`;

const Container = styled.div`
  background-color: ${(props) => props.theme.background.primary};
`;

const Title = styled.h1`
  color: ${(props) => props.theme.color.primary};
`;

export const AuthPage = () => {
  return (
    <Container>
      <Title>You need to login.</Title>
      <button onClick={() => darkModeVar(true)}>To Dark</button>
      <button onClick={() => darkModeVar(false)}>To Light</button>
    </Container>
  );
};
