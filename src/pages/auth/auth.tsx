import { gql, useMutation } from "@apollo/client";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { makeLogin } from "../../apollo/vars";
import {
  MutationCreateAccount,
  MutationCreateAccountVariables,
} from "../../codegen/MutationCreateAccount";
import {
  MutationLogin,
  MutationLoginVariables,
} from "../../codegen/MutationLogin";

import { BarWithText } from "../../components/BarAndText";
import { ButtonInactivable } from "../../components/ButtonInactivable";

import { HelmetOnlyTitle } from "../../components/HelmetOnlyTitle";
import { LayoutContainer } from "../../components/LayoutContainer";

import { EMAIL_REGEX } from "../../utils";

const GQL_CREATE_ACCOUNT = gql`
  mutation MutationCreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

export const GQL_LOGIN = gql`
  mutation MutationLogin($input: LoginInput!) {
    login(input: $input) {
      ok
      token
      error
    }
  }
`;

const Container = styled(LayoutContainer)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconFacebook = styled(FontAwesomeIcon)`
  margin-right: 8px;
  background-color: inherit;
  color: ${(props) => props.theme.color.secondary};
`;

const SpanFacebook = styled.span`
  color: white;
  font-size: 14px;
  background-color: inherit;
  color: white;
  font-weight: 600;
`;

const Title = styled.h1`
  font-family: "Amarillo";
  font-size: 1.5rem;
  color: ${(props) => props.theme.color.primary};
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const FormContainer = styled.form<{ isCreating: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 350px;
  width: 100%;
  height: ${(props) => (props.isCreating ? "640px" : "380px")};

  padding: 1.5rem;
  margin-top: 2rem;
  border: 1px ${(props) => props.theme.color.border} solid;
  background-color: ${(props) => props.theme.background.secondary};
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 1rem;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const SpanUnderLogo = styled.span`
  margin-top: 1.5rem;
  margin-bottom: 8px;
  font-size: 1.3rem;
  color: gray;
  font-weight: bold;
  text-align: center;
`;

const Input = styled.input`
  border-radius: 3px;
  border: 1px gray solid;
  padding: 0.5rem;
  outline: none;
  background-color: #eee;
`;

const ErrorMsg = styled.span`
  color: red;
  font-style: italic;
  font-size: 12px;
  margin-top: 2px;
`;

const CAContainer = styled.div`
  display: flex;
  max-width: 350px;
  width: 100%;
  height: 63px;
  align-items: center;
  justify-content: center;
  border: 1px ${(props) => props.theme.color.border} solid;
  margin-top: 20px;
  background-color: ${(props) => props.theme.background.secondary};
`;

const CASpan = styled.span`
  font-size: 16px;
  margin-right: 8px;
`;

const CALink = styled(Link)`
  font-size: 16px;
  color: ${(props) => props.theme.color.link};
`;

interface AuthPageProps {
  isCreating?: boolean;
}

interface FormElement {
  email: string;
  username: string;
  firstName: string;
  password: string;
  password2: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ isCreating = true }) => {
  const {
    register,
    getValues,
    formState,
    errors,
    handleSubmit,
    reset,
  } = useForm<FormElement>({
    mode: "onChange",
  });
  const history = useHistory();
  const { isValid, isDirty } = formState;
  const [loading, setLoading] = useState(false);
  const [createAccount] = useMutation<
    MutationCreateAccount,
    MutationCreateAccountVariables
  >(GQL_CREATE_ACCOUNT, {
    onCompleted: (data: MutationCreateAccount) => {
      setLoading(false);
      if (data.createAccount.ok) {
        toast.success("계정이 만들어졌습니다. 로그인 해주세요.");
        history.push("/");
      } else {
        toast.error(
          `계정 만들기에 실패했습니다.\n에러: ${data.createAccount.error}`
        );
      }
    },
  });

  const [login] = useMutation<MutationLogin, MutationLoginVariables>(
    GQL_LOGIN,
    {
      onCompleted: ({ login }: MutationLogin) => {
        setLoading(false);
        if (login.ok && login.token) {
          makeLogin(login.token);
          toast.success("로그인 하였습니다.");
        } else {
          toast.error(`로그인 에러\n에러: ${login.error}`);
        }
      },
    }
  );

  const onSubmit = () => {
    const { username, password, firstName, email } = getValues();
    setLoading(true);
    if (isCreating) {
      createAccount({
        variables: {
          input: {
            email,
            password,
            username,
            firstName,
          },
        },
      });
    } else {
      login({
        variables: {
          input: {
            username,
            password,
          },
        },
      });
    }
  };

  useEffect(() => {
    reset({
      email: "",
      password2: "",
      password: "",
      firstName: "",
      username: "",
    });
  }, [isCreating, reset]);

  return (
    <Container>
      <HelmetOnlyTitle title={`${isCreating ? "Sign up" : "Log in"}`} />
      <FormContainer isCreating={isCreating} onSubmit={handleSubmit(onSubmit)}>
        <Title>Instagram</Title>
        {isCreating && (
          <>
            <SpanUnderLogo>
              친구들과 사진과 동영상을 보려면 가입하세요.
            </SpanUnderLogo>
            <ButtonInactivable isActivate={true} loading={false}>
              <IconFacebook icon={faFacebookSquare} color="white" />
              <SpanFacebook>페이스북으로 가입~</SpanFacebook>
            </ButtonInactivable>
            <BarWithText text="또는" />
          </>
        )}
        <InputContainer>
          <InputWrapper>
            <Input
              ref={register({
                required: true,
                minLength: {
                  value: 4,
                  message: "4글자 이상 입력해주세요",
                },
                maxLength: {
                  value: 20,
                  message: "20글자 이하로 입력해주세요.",
                },
              })}
              name="username"
              type="text"
              placeholder="사용자이름"
            />
            {errors.username && <ErrorMsg>{errors.username.message}</ErrorMsg>}
          </InputWrapper>

          {isCreating && (
            <>
              <InputWrapper>
                <Input
                  ref={register({
                    required: true,
                    pattern: {
                      value: EMAIL_REGEX,
                      message: "이메일 주소가 아닙니다.",
                    },
                  })}
                  name="email"
                  type="text"
                  placeholder="이메일 주소"
                />
                {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
              </InputWrapper>
              <InputWrapper>
                <Input
                  ref={register({
                    required: true,
                    minLength: {
                      value: 3,
                      message: "3글자 이상 입력해주세요",
                    },
                    maxLength: {
                      value: 20,
                      message: "20글자 이하로 입력해주세요.",
                    },
                  })}
                  name="firstName"
                  type="text"
                  placeholder="이름"
                />
                {errors.firstName && (
                  <ErrorMsg>{errors.firstName.message}</ErrorMsg>
                )}
              </InputWrapper>
            </>
          )}
          <InputWrapper>
            <Input
              ref={register({
                required: true,
                minLength: {
                  value: 6,
                  message: "6글자 이상 입력해주세요.",
                },
                maxLength: {
                  value: 18,
                  message: "18글자 이하로 입력해주세요.",
                },
              })}
              name="password"
              type="password"
              placeholder="암호"
            />
            {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
          </InputWrapper>
          {isCreating && (
            <InputWrapper>
              <Input
                ref={register({
                  required: true,
                  minLength: {
                    value: 6,
                    message: "6글자 이상 입력해주세요.",
                  },
                  maxLength: {
                    value: 18,
                    message: "18글자 이하로 입력해주세요.",
                  },
                  validate: {
                    value: (value) =>
                      value === getValues("password") ||
                      "패스워드가 일치하지 않습니다.",
                  },
                })}
                name="password2"
                type="password"
                placeholder="암호 확인"
              />
              {errors.password2 && (
                <ErrorMsg>{errors.password2.message}</ErrorMsg>
              )}
            </InputWrapper>
          )}

          <ButtonInactivable
            isActivate={isValid && isDirty && !loading}
            loading={loading}
          >
            {isCreating ? "계정 만들기" : "로그인"}
          </ButtonInactivable>
        </InputContainer>
        {!isCreating && (
          <>
            <BarWithText text="또는" />

            <span style={{ fontWeight: 600 }}>
              <IconFacebook icon={faFacebookSquare} size="lg" />
              페이스북으로 로그인
            </span>
          </>
        )}
      </FormContainer>
      {!isCreating && (
        <>
          <CAContainer>
            <CASpan>계정이 없으신가요?</CASpan>
            <CALink to="/create-account">가입하기</CALink>
          </CAContainer>
        </>
      )}
      {!!isCreating && (
        <>
          <CAContainer>
            <CASpan>계정이 있으신가요?</CASpan>
            <CALink to="/">로그인하기</CALink>
          </CAContainer>
        </>
      )}
    </Container>
  );
};
