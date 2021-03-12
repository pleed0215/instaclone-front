import React from "react";
import styled from "styled-components";
import { LayoutContainer } from "./LayoutContainer";

const Container = styled(LayoutContainer)`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  background-color: blue;
`;

export const Header: React.FC = () => {
  return (
    <Container>
      <div>
        <img src="instalogo.png" />
      </div>
      <div>
        <input type="text" />
      </div>
      <div></div>
    </Container>
  );
};
