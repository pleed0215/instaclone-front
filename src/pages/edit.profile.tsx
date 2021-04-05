import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled, { css } from "styled-components";
import { LayoutContainer } from "../components/LayoutContainer";
import { useMe } from "../hooks/useMe";

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

const ErrorMsg = styled.span`
  color: red;
  font-style: italic;
  font-size: 12px;
  margin-top: 2px;
`;

const ProfileEdit: React.FC<{ id: number }> = ({ id }) => {
  const { register, handleSubmit, formState, errors } = useForm<ProfileForm>({
    mode: "onChange",
  });
  const [updateProfile] = useMutation(GQL_UPDATE_PROFILE);

  const onValid = (data: ProfileForm) => {};

  return <Form onSubmit={handleSubmit(onValid)}>
    <InputContainer>
    <InputWrapper>
      <Input type="text" name="" />
    </InputWrapper>
    </InputContainer>
  </Form>;
};

export const ProfileEditPage = () => {
  const { register, handleSubmit, formState, errors } = useForm<PasswordForm>({
    mode: "onChange",
  });
  const [tab, setTab] = useState(0); // 0 === profile, 1 === password
  const {data: me} = useMe();

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
      {me && tab === 0 && <TabContent><ProfileEdit id={me?.seeMe.id}/></TabContent>}
      {me && tab === 1 && <TabContent>Tab 1</TabContent>}
    </Container>
  );
};
