import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled, { css } from "styled-components";

enum AvatarSize {
  xs = "0.75em",
  sm = "1.5em",
  lg = "1.8em",
  "2x" = "2em",
  "3x" = "3em",
  "4x" = "4em",
  "5x" = "5em",
}

type AvatarSizeType = keyof typeof AvatarSize;

interface AvatarProps {
  url: string | null | undefined;
  size: AvatarSizeType;
}

const AvatarContainer = styled.div<AvatarProps>`
  width: ${(props) => AvatarSize[props.size]};
  height: ${(props) => AvatarSize[props.size]};
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 50%;
  background-color: ${(props) => props.theme.background.avatar};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  ${(props) =>
    props.url &&
    css`
      background-image: url(${props.url});
    `};
`;

export const Avatar: React.FC<AvatarProps> = ({ url, size }) => {
  return (
    <AvatarContainer size={size} url={url}>
      {!url && <FontAwesomeIcon icon={faUser} size={size} color="gray" />}
    </AvatarContainer>
  );
};
