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
import { EMAIL_REGEX } from "../../utils";

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
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: "Amarillo";
  font-size: 1.5rem;
  color: ${(props) => props.theme.color.primary};
  margin-top: 1rem;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  height: 380px;

  padding: 1.5rem;
  margin-top: 2rem;
  border: 1px gray solid;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 2rem;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const Input = styled.input`
  border-radius: 5px;
  border: 1px gray solid;
  padding: 0.5rem;
  outline: none;
  background-color: #e3e3e3;
`;

const ErrorMsg = styled.span`
  color: red;
  font-style: italic;
  font-size: 12px;
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
  const { register, getValues, formState, errors, handleSubmit } = useForm<FormElement>({
    mode: "onChange",
  });
  const [createAccount] = useMutation<
    MutationCreateAccount,
    MutationCreateAccountVariables
  >(GQL_CREATE_ACCOUNT);
  const [login] = useMutation<MutationLogin, MutationLoginVariables>(GQL_LOGIN);
  const onSubmit = () => {
    console.log(getValues());
  }

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <Title>Instagram</Title>
        <InputContainer>
          <InputWrapper>
            <Input
              ref={register({
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Must be email address, check again please.",
                },
              })}
              name="email"
              type="text"
              placeholder="Email address"
            />
            {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
          </InputWrapper>
          {isCreating && (
            <>
              <InputWrapper>
                <Input
                  ref={register({
                    minLength: {
                      value: 3,
                      message: "Too short, must be longter than 3 letters",
                    },
                    maxLength: {
                      value: 20,
                      message: "Too long, can you shorten to 20 letters?",
                    },
                  })}
                  name="firstName"
                  type="text"
                  placeholder="First name"
                />
                {errors.firstName && (
                  <ErrorMsg>{errors.firstName.message}</ErrorMsg>
                )}
              </InputWrapper>
              <InputWrapper>
                <Input
                  ref={register({
                    maxLength: {
                      value: 20,
                      message: "Too long, can you shorten to 20 letters?",
                    },
                  })}
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <ErrorMsg>{errors.lastName.message}</ErrorMsg>
                )}
              </InputWrapper>
            </>
          )}
          <InputWrapper>
            <Input
              ref={register({
                minLength: {
                  value: 6,
                  message:
                    "Too short, password must be longter than 6 characters.",
                },
                maxLength: {
                  value: 18,
                  message: "Too long, can you shorten under 18 letters?",
                },
              })}
              name="password"
              type="password"
              placeholder="Password"
            />
            {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
          </InputWrapper>
          {isCreating && (
            <InputWrapper>
              <Input
                ref={register({
                  minLength: {
                    value: 6,
                    message:
                      "Too short, password must be longter than 6 characters.",
                  },
                  maxLength: {
                    value: 18,
                    message: "Too long, can you shorten under 18 letters?",
                  },
                })}
                name="password2"
                type="password"
                placeholder="Check your password"
              />
              {errors.password2 && (
                <ErrorMsg>{errors.password2.message}</ErrorMsg>
              )}
            </InputWrapper>
          )}

          <ButtonInactivable isActivate={true} loading={true}>
            {isCreating ? "Create Account" : "Login"}
          </ButtonInactivable>
        </InputContainer>
      </FormContainer>
    </Container>
  );
};
