import { gql } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { LayoutContainer } from "../components/LayoutContainer";

interface ProfileForm {
  username: string;
  email: string;
  firstName: string;
  bio?: string;
  currentPassword?: string;
  newPassword?: string;
  checkPassword?: string;
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
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

export const ProfileEditPage = () => {
  const { register, handleSubmit, formState, errors } = useForm<ProfileForm>({
    mode: "onChange",
  });
  <Container>아직 구현 안됨.</Container>;
};
