import React, { useState } from "react";
import styled, { useTheme } from "styled-components";
import { PartPhoto } from "../codegen/PartPhoto";
import { breakpoints, device } from "../theme/theme";
import { makeLinkText, timeSince } from "../utils";

import { Collapse } from "./Collapse";
import { CommentItem } from "./CommentItem";

import { WriteComment } from "./WriteComment";
import { PhotoDetail } from "./PhotoDetail";
import { PhotoMenu } from "./PhotoMenu";
import { Actions } from "./Actions";
import { AvatarAndUsername } from "./Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

interface PhotoItemProps {
  photo: PartPhoto;
}

const PhotoItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  border: 1px solid ${(props) => props.theme.color.border};
  margin-bottom: 60px;
  min-height: 60px;
`;

const Photo = styled.div<{ url: string }>`
  ${device.sm} {
    min-height: ${breakpoints.sm};
  }
  ${device.xs} {
    min-height: ${breakpoints.xs};
  }

  width: 100%;
  background-position: center center;
  background-size: cover;
  background-image: url(${(props) => props.url});
`;

const PhotoContentContainer = styled.div`
  width: 100%;
  padding: 5px 16px;
  display: flex;
  flex-direction: column;
`;

const SpanNumLike = styled.span`
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 5px;
`;

const ButtonSeeMoreComment = styled.button`
  color: ${(props) => props.theme.color.secondary};
  margin-top: 2px;
  margin-bottom: 3px;
  display: inline-block;
  width: fit-content;
`;

const SpanTimeSince = styled.span`
  font-size: 13px;
  font-weight: 300;
  font-style: italic;
  margin-top: 3px;
  margin-bottom: 3px;
`;

export const PhotoItem: React.FC<PhotoItemProps> = ({ photo }) => {
  const [canSee, setCanSee] = useState(false);
  const [menuSee, setMenuSee] = useState(false);
  const theme = useTheme();
  return (
    <>
      <PhotoDetail photoId={photo.id} canSee={canSee} setCanSee={setCanSee} />
      <PhotoMenu
        photoId={photo.id}
        canSee={menuSee}
        setCanSee={setMenuSee}
        isOwner={photo.isMine}
      />
      <PhotoItemWrapper>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <AvatarAndUsername
            url={photo.user.avatar}
            size="lg"
            username={photo.user.username}
            firstName={photo.user.firstName}
            linkable
          />
          <button
            onClick={() => setMenuSee(!menuSee)}
            style={{ marginRight: 10 }}
          >
            <FontAwesomeIcon icon={faEllipsisH} color={theme.color.primary} />
          </button>
        </div>
        <Photo url={photo.file} />
        <PhotoContentContainer>
          <Actions photoId={photo.id} isLiked={photo.isLiked} />
          <SpanNumLike>좋아요 {photo.numLikes}개</SpanNumLike>
          <span style={{ fontWeight: "bold" }}>{photo.user.username}</span>
          <Collapse collapsed={true} text={"...더보기"}>
            <span>{makeLinkText(photo.caption!)}</span>
          </Collapse>
          <ButtonSeeMoreComment onClick={() => setCanSee(true)}>
            댓글 {photo.numComments}개 더 보기
          </ButtonSeeMoreComment>
          {photo.comments.slice(0, 2).map((comment) => (
            <CommentItem
              key={comment.id}
              payload={comment.payload}
              commentId={comment.id}
              user={comment.user}
              isMine={comment.isMine}
              photoId={photo.id}
            />
          ))}
          <SpanTimeSince>{timeSince(photo.createdAt)} ago</SpanTimeSince>
        </PhotoContentContainer>
        <div
          style={{
            height: 1,
            width: "100%",
            backgroundColor: theme.color.border,
          }}
        />
        <WriteComment photoId={photo.id} />
      </PhotoItemWrapper>
    </>
  );
};
