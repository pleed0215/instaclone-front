import React from "react";
import styled from "styled-components";
import { LayoutContainer } from "./LayoutContainer";

const HeaderContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: ${(props) => props.theme.background.primary};
  border-bottom: 1px solid ${(props) => props.theme.color.border};
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Container = styled(LayoutContainer)`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  flex: 1 0 0%;
`;
const SearchContainer = styled.div``;
const MenuContainer = styled.div`
  flex: 1 0 0%;
`;

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Container>
        <LogoContainer>
          <img src="/instalogo.png" />
        </LogoContainer>
        <SearchContainer>
          <input type="text" />
        </SearchContainer>
        <MenuContainer />
      </Container>
    </HeaderContainer>
  );
};
