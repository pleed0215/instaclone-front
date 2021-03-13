import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { darkModeVar } from "../../apollo/vars";
import {
  MutationCreateAccount,
  MutationCreateAccountVariables,
} from "../../codegen/MutationCreateAccount";
import {
  MutationLogin,
  MutationLoginVariables,
} from "../../codegen/MutationLogin";
import { ButtonInactivable } from "../../components/ButtonInactivable";
import { LayoutContainer } from "../../components/LayoutContainer";
import { Loader } from "../../components/Loader";

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

const Container = styled(LayoutContainer)`
  width: 100%;
  background-color: red;
`;

const Title = styled.h1`
  font-family: "Amarillo";
  margin-top: 30px;
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
  const [createAccount] = useMutation<
    MutationCreateAccount,
    MutationCreateAccountVariables
  >(GQL_CREATE_ACCOUNT);
  const [login] = useMutation<MutationLogin, MutationLoginVariables>(GQL_LOGIN);

  return (
    <Container>
      <Title>You need to login.</Title>
    </Container>
  );
};
