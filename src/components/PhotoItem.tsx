import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment as farComment,
  faPaperPlane as farPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import React from "react";
import styled from "styled-components";
import { PartPhoto } from "../codegen/PartPhoto";
import { breakpoints, device } from "../theme/theme";
import { timeSince } from "../utils";
import { Avatar } from "./Avatar";
import { Collapse } from "./Collapse";
import { CommentItem } from "./CommentItem";
import { LikeButton } from "./LikeButton";
import { WriteComment } from "./WriteComment";

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

const PhotoItemHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 16px;
`;

const PhotoItemHeaderUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
`;

const PhotoItemHeaderUsername = styled.span`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 3px;
`;

const PhotoItemHeaderName = styled.span`
  font-size: 14px;
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

const PhotoMenuContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
`;

const PhotoMenuItem = styled(FontAwesomeIcon)`
  &:not(:last-child) {
    margin-right: 1rem;
  }
  padding: 5px;
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
  return (
    <PhotoItemWrapper>
      <PhotoItemHeader>
        <Avatar url={photo.user.avatar} size="lg" />
        <PhotoItemHeaderUserInfo>
          <PhotoItemHeaderUsername>
            {photo.user.username}
          </PhotoItemHeaderUsername>
          <PhotoItemHeaderName>{photo.user.firstName}</PhotoItemHeaderName>
        </PhotoItemHeaderUserInfo>
      </PhotoItemHeader>
      <Photo url={photo.file} />
      <PhotoContentContainer>
        <PhotoMenuContainer>
          <LikeButton photoId={photo.id} isLike={photo.isLiked} />
          <PhotoMenuItem icon={farPaperPlane} size="2x" />
          <PhotoMenuItem icon={farComment} size="2x" />
        </PhotoMenuContainer>
        <SpanNumLike>좋아요 {photo.numLikes}개</SpanNumLike>
        <span style={{ fontWeight: "bold" }}>{photo.user.username}</span>
        <Collapse collapsed={true} text={"...더보기"}>
          <span>{photo.caption}</span>
        </Collapse>
        <ButtonSeeMoreComment>
          댓글 {photo.numComments}개 더 보기
        </ButtonSeeMoreComment>
        {photo.comments.map((comment) => (
          <CommentItem
            key={comment.id}
            payload={comment.payload}
            user={comment.user}
          />
        ))}
        <SpanTimeSince>{timeSince(photo.createdAt)} ago</SpanTimeSince>
      </PhotoContentContainer>
      <WriteComment photoId={photo.id} />
    </PhotoItemWrapper>
  );
};
