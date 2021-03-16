import React from "react";
import styled from "styled-components";
import { useMe } from "../hooks/useMe";

const Container = styled.div`
  min-height: 100vh;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.color};
  background-color: ${(props) => props.theme.background};
`;

export const HomePage = () => {
  const { loading, data, error } = useMe();

  return (
    <Container>
      <Title>Hello</Title>
    </Container>
  );
};
