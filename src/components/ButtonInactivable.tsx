import React from "react";
import styled, { css } from "styled-components";
import { Loader } from "./Loader";

interface IButtonInactivableType {
  isActivate?: boolean;
  loading: boolean;
}

const Button = styled.button<{ isActive?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-width: min-content;
  height: 32px;
  ${(props) =>
    !props.isActive &&
    css`
      pointer-events: none;
    `};
  background-color: ${(props) => (props.isActive ? "#c0dffd" : "#E0E0E0")};
  color: white;
  outline: none;
  border: none;
  cursor: pointer;
  &:hover {
    ${(props) =>
      props.isActive &&
      css`
        background-color: #279b9b;
      `};
  }
  transition: background-color 0.3s;
  border-radius: 5px;
`;

export const ButtonInactivable: React.FC<IButtonInactivableType> = ({
  children,
  ...props
}) => {
  const { isActivate, loading, ...rest } = props;

  return (
    <Button isActive={isActivate} {...rest}>
      {loading ? <Loader /> : children}
    </Button>
  );
};
