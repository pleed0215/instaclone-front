import React from "react";
import styled from "styled-components";

enum AvatarSize {
  xs = "0.75em",
  sm = "0.875em",
  md = "1.0em",
  lg = "1.33em",
  "2x" = "2em",
  "3x" = "3em",
  "4x" = "4em",
  "5x" = "5em",
}

type AvatarSizeType = keyof typeof AvatarSize;

interface AvatarProps {
  url: string | null;

  size: AvatarSizeType;
}

const AvatarContainer = styled.div<{ size: AvatarSizeType }>`
  width: ${(props) => AvatarSize[props.size]};
  height: ${(props) => AvatarSize[props.size]};
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 50%;
  background-color: ${(props) => props.theme.background.avatar};
  display: flex;
  background-size: cover;
  background-position: center center;
`;

export const Avatar: React.FC<AvatarProps> = ({ url, size }) => {
  return <AvatarContainer size="sm"></AvatarContainer>;
};
