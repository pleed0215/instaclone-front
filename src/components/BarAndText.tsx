import React from "react";
import styled from "styled-components";

const Bar = styled.div`
  background-color: rgba(219, 219, 219, 1);
  height: 1px;
  flex-grow: 1;
  flex-shrink: 1;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0px;
  width: 100%;
`;

const Text = styled.div`
  color: rgba(142, 142, 142, 1);
  flex-shrink: 0;
  flex-grow: 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 15px;
  margin: 0 18px;
  text-transform: uppercase;
`;

export const BarWithText: React.FC<{ text: string }> = ({ text }) => (
  <Container>
    <Bar />
    <Text>{text}</Text>
    <Bar />
  </Container>
);
