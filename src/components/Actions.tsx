import {
  faComment as farComment,
  faPaperPlane as farPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import { LikeButton } from "./LikeButton";

interface ActionsProp {
  photoId: number;
  isLiked: boolean;
}

const PhotoMenuContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const PhotoMenuItem = styled(FontAwesomeIcon)`
  &:not(:last-child) {
    margin-right: 1rem;
  }
  padding: 5px;
`;

export const Actions: React.FC<ActionsProp> = ({ photoId, isLiked }) => {
  return (
    <PhotoMenuContainer>
      <LikeButton photoId={photoId} isLike={isLiked} />
      <PhotoMenuItem icon={farPaperPlane} size="2x" />
      <PhotoMenuItem icon={farComment} size="2x" />
    </PhotoMenuContainer>
  );
};
