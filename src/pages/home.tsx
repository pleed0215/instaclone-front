import React from "react";
import styled from "styled-components";

const Container = styled.div``;

const Title = styled.h1`
  color: ${(props) => props.theme.color};
  background-color: ${(props) => props.theme.background};
`;

export const HomePage = () => {
  return (
    <Container>
      <Title>Hello</Title>
    </Container>
  );
};
