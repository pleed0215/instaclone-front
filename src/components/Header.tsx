import { useReactiveVar } from "@apollo/client";
import {
  faCommentAlt,
  faCompass,
  faHome,
  faMoon,
  faSearch,
  faSun,
  faTimesCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { darkModeVar, setDarkMode } from "../apollo/vars";
import { device } from "../theme/theme";
import { LayoutContainer } from "./LayoutContainer";
import { ToggleSwitch } from "./ToggleSwitch";

const HeaderContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: ${(props) => props.theme.background.primary};
  border-bottom: 1px solid ${(props) => props.theme.color.border};
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  transition: background-color 0.4s;
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
const SearchContainer = styled.div`
  ${device.xs} {
    display: none;
  }
  width: 215px;
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
`;
const MenuContainer = styled.div`
  flex: 1 0 0%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const MenuLink = styled(Link)`
  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

const IconMenu = styled(FontAwesomeIcon)`
  color: ${(props) => props.color};
`;

const IconSearch = styled(FontAwesomeIcon)`
  position: absolute;
  left: 5px;
  color: darkgray;
`;
const IconReset = styled(FontAwesomeIcon)`
  position: absolute;
  right: 5px;
  color: darkgray;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 5px 10px 5px 20px;
  border-radius: 5px;
  outline: none;
  background-color: #efefef;
  border: 1px solid ${(props) => props.theme.color.border};
  font-size: 12px;
`;

const ToggleDarkContainer = styled.div`
  display: flex;
  align-items: center;
  & > :not(:last-child) {
    margin-right: 10px;
    margin-left: 10px;
  }
`;

const IconSun = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.color.primary};
`;

export const Header: React.FC = () => {
  const [term, setTerm] = useState("");
  const onDarkModeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDarkMode(e.target.checked);
  };
  const isDark = useReactiveVar(darkModeVar);

  return (
    <HeaderContainer>
      <Container>
        <LogoContainer>
          <img
            alt="instagram logo"
            src={isDark ? "/instalogo_dark.png" : "/instalogo.png"}
          />
        </LogoContainer>
        <SearchContainer>
          <IconSearch icon={faSearch} size="xs" />
          <SearchInput
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            type="text"
            placeholder="검색"
          />
          <IconReset
            icon={faTimesCircle}
            size="xs"
            onClick={() => setTerm("")}
          />
        </SearchContainer>
        <MenuContainer>
          <MenuLink to="/">
            <IconMenu icon={faHome} size="lg" />
          </MenuLink>
          <MenuLink to="/direct/inbox">
            <IconMenu icon={faCommentAlt} size="lg" />
          </MenuLink>
          <MenuLink to="/activity">
            <IconMenu icon={faCompass} size="lg" />
          </MenuLink>
          <span>
            <FontAwesomeIcon icon={faUser} size="lg" />
          </span>
          <ToggleDarkContainer>
            <IconSun icon={isDark ? faSun : faMoon} />
            <ToggleSwitch
              onChange={onDarkModeChange}
              defaultChecked={darkModeVar()}
            />
          </ToggleDarkContainer>
        </MenuContainer>
      </Container>
    </HeaderContainer>
  );
};
