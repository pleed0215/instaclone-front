import { gql } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
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
  font-family: "Amarillo";
  color: ${(props) => props.theme.color.primary};
`;

interface AuthPageProps {
  isCreating?: boolean;
}

interface FormElement {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  password2: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ isCreating = true }) => {
  const { register, getValues, formState } = useForm<FormElement>({
    mode: "onChange",
  });

  return (
    <Container>
      <Title>You need to login.</Title>
      <button onClick={() => darkModeVar(true)}>To Dark</button>
      <button onClick={() => darkModeVar(false)}>To Light</button>
    </Container>
  );
};
