import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";
import { makeLogout } from "../apollo/vars";
import {
  MutationUpdateProfile,
  MutationUpdateProfileVariables,
} from "../codegen/MutationUpdateProfile";
import { QuerySeeMe_seeMe } from "../codegen/QuerySeeMe";
import { ButtonInactivable } from "../components/ButtonInactivable";
import { LayoutContainer } from "../components/LayoutContainer";
import { useMe } from "../hooks/useMe";
import { EMAIL_REGEX } from "../utils";

interface ProfileForm {
  username: string;
  email: string;
  firstName: string;
  bio?: string;
}

interface PasswordForm {
  current: string;
  password: string;
  check: string;
}

const GQL_UPDATE_PROFILE = gql`
  mutation MutationUpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ok
      error
    }
  }
`;

const Container = styled(LayoutContainer)`
  background-color: ${(props) => props.theme.background.primary};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 50vw;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.background.primary};
  width: 300px;
  min-height: 50vh;
  border: 1px solid ${(props) => props.theme.color.border};
  border-right: none;
`;

const TabItem = styled.div<{ isActive?: boolean }>`
  padding: 10px;
  text-align: center;
  ${(props) =>
    props.isActive
      ? css`
          border-left: 2px solid ${props.theme.color.link};
          background-color: ${props.theme.background.secondary};
        `
      : css`
          background-color: ${props.theme.background.primary};
        `};
  cursor: pointer;
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${(props) => props.theme.color.border};
  background-color: ${(props) => props.theme.background.secondary};
  min-height: 50vh;
  padding: 10px;
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

const Input = styled.input`
  border-radius: 3px;
  border: 1px gray solid;
  padding: 0.5rem;
  outline: none;
  background-color: #eee;
`;

const TextArea = styled.textarea`
  border-radius: 3px;
  border: 1px gray solid;
  padding: 0.5rem;
  outline: none;
  background-color: #eee;
  resize: none;
`;

const ErrorMsg = styled.span`
  color: red;
  font-style: italic;
  font-size: 12px;
  margin-top: 2px;
`;

const ProfileEdit: React.FC<{ me: QuerySeeMe_seeMe }> = ({ me }) => {
  const { register, handleSubmit, formState, errors } = useForm<ProfileForm>({
    mode: "onChange",
    defaultValues: {
      ...me,
    },
  });
  const [loginAgain, setLoginAgain] = useState(false);
  const history = useHistory();
  const [updateProfile] = useMutation<
    MutationUpdateProfile,
    MutationUpdateProfileVariables
  >(GQL_UPDATE_PROFILE, {
    onCompleted: () => {
      setLoading(false);
      if (loginAgain) {
        alert("다시 로그인 해야 합니다.");
        history.push("/");
        makeLogout();
      } else {
        history.push(`/users/${me.username}`);
      }
    },
  });
  const [loading, setLoading] = useState(false);

  const onValid = (data: ProfileForm) => {
    setLoading(true);
    updateProfile({
      variables: {
        input: { id: me.id, ...data },
      },
      update(cache, result) {
        if (result.data?.updateProfile.ok) {
          if (data.username !== me.username) {
            setLoginAgain(true);
          }
          cache.modify({
            id: `User:${me.id}`,
            fields: {
              username: () => data.username,
              firstName: () => data.firstName,
              email: () => data.email,
              bio: () => data.bio,
            },
          });
        } else {
          toast.error(`업데이트 실패: ${result.data?.updateProfile.error}`);
        }
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit(onValid)}>
      <InputContainer>
        <InputWrapper>
          <span>사용자이름</span>
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
        <InputWrapper>
          <span>이메일 주소</span>
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
          <span>성함</span>
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
          {errors.firstName && <ErrorMsg>{errors.firstName.message}</ErrorMsg>}
        </InputWrapper>
        <InputWrapper>
          <span>자기소개</span>
          <TextArea
            ref={register({
              maxLength: {
                value: 300,
                message: "300글자 이하로 입력해주세요.",
              },
            })}
            name="bio"
            placeholder="자기소개"
          />
          {errors.bio && <ErrorMsg>{errors.bio.message}</ErrorMsg>}
        </InputWrapper>
        <ButtonInactivable
          isActivate={formState.isValid && !formState.isSubmitting}
          loading={loading}
        >
          업데이트
        </ButtonInactivable>
      </InputContainer>
    </Form>
  );
};

export const ProfileEditPage = () => {
  const { register, handleSubmit, formState, errors } = useForm<PasswordForm>({
    mode: "onChange",
  });
  const [tab, setTab] = useState(0); // 0 === profile, 1 === password
  const { data: me } = useMe();

  const onTabClick = (index: number) => () => {
    setTab(index);
  };

  return (
    <Container>
      <TabContainer>
        <TabItem onClick={onTabClick(0)} isActive={tab === 0}>
          프로필 편집
        </TabItem>
        <TabItem onClick={onTabClick(1)} isActive={tab === 1}>
          패스워드 변경
        </TabItem>
      </TabContainer>
      <TabContent>
        {me && tab === 0 && <ProfileEdit me={me?.seeMe} />}
        {me && tab === 1 && <TabContent>Tab 1</TabContent>}
      </TabContent>
    </Container>
  );
};
