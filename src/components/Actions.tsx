import {
  faComment as farComment,
  faPaperPlane as farPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { LikeButton } from "./LikeButton";

interface ActionsProp {
  photoId: number;
  isLiked: boolean;
  setFocus: React.Dispatch<boolean>;
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
  cursor: pointer;
`;

export const Actions: React.FC<ActionsProp> = ({
  photoId,
  isLiked,
  setFocus,
}) => {
  const history = useHistory();
  return (
    <PhotoMenuContainer>
      <LikeButton photoId={photoId} isLike={isLiked} />
      <PhotoMenuItem
        icon={farPaperPlane}
        size="2x"
        onClick={() => history.push(`/direct`)}
      />
      <PhotoMenuItem
        icon={farComment}
        size="2x"
        onClick={() => {
          setFocus(true);
          setTimeout(() => {
            setFocus(false);
          }, 500);
        }}
      />
    </PhotoMenuContainer>
  );
};
