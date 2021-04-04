import { gql, useQuery } from "@apollo/client";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MouseEvent, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  QueryPhotoDetail,
  QueryPhotoDetailVariables,
} from "../codegen/QueryPhotoDetail";
import { PART_COMMENT, SMALL_PART_PHOTO } from "../fragments";
import { makeLinkText, timeSince } from "../utils";
import { Actions } from "./Actions";
import { AvatarAndUsername } from "./Avatar";
import { CommentItem } from "./CommentItem";
import { LayoutContainer } from "./LayoutContainer";
import { WriteComment } from "./WriteComment";

const GQL_PHOTO_DETAIL = gql`
  query QueryPhotoDetail(
    $input: SeePhotoDetailInput!
    $offset: Int
    $limit: Int
  ) {
    seePhotoDetail(input: $input) {
      ok
      error
      photo {
        ...SmallPartPhoto
        comments(orderBy: { createdAt: desc }, skip: $offset, take: $limit) {
          ...PartComment
        }
      }
    }
  }
  ${SMALL_PART_PHOTO}
  ${PART_COMMENT}
`;

interface PhotoDetailProp {
  photoId: number;
  canSee: boolean;
  setCanSee: React.Dispatch<boolean>;
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(30, 30, 30, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const XBox = styled.button`
  width: 30px;
  height: 30px;
  right: 0px;
  top: -30px;
  position: absolute;
  z-index: 30;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const InnerBox = styled(LayoutContainer)`
  max-height: 70vh;
  height: 100%;

  flex-direction: row;
  justify-content: flex-start;
  z-index: 20;
  position: relative;
  background-color: ${(props) => props.theme.background.primary};
`;

const PhotoBox = styled.div<{ url: string }>`
  max-width: 600px;
  width: 100%;
  background-position: center center;
  background-image: url(${(props) => props.url});
  background-size: cover;
  border: 1px solid ${(props) => props.theme.color.border};
`;

const ContentWrapper = styled.div`
  max-width: 392px;
  width: 100%;

  max-height: 70vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 1px solid ${(props) => props.theme.color.border};
  border-left: transparent;
`;
const ProfileBox = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.color.border};
`;
const ContentBox = styled.div`
  padding: 10px;
  border-bottom: 1px solid ${(props) => props.theme.color.border};
  height: 100%;
  max-height: 46vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;
const ActionBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
`;
const CommentBox = styled.div`
  display: flex;
  align-items: center;
`;
const SpanCaption = styled.span`
  font-size: 14px;
  font-weight: 400;
  margin-left: 10px;
  margin-top: 3px;
  margin-bottom: 3px;
`;
const SpanTimeSince = styled.span`
  font-size: 13px;
  font-weight: 300;
  font-style: italic;
  margin-left: 10px;
  margin-top: 3px;
  margin-bottom: 3px;
`;
const SpanNumLike = styled.span`
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 5px;
`;

export const PhotoDetail: React.FC<PhotoDetailProp> = ({
  photoId,
  canSee,
  setCanSee,
}) => {
  const toggleVisible = (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (e.target === parentBox.current) {
      setCanSee(!canSee);
    }
  };
  const parentBox = useRef<HTMLDivElement>(null);
  const { data, loading } = useQuery<
    QueryPhotoDetail,
    QueryPhotoDetailVariables
  >(GQL_PHOTO_DETAIL, {
    variables: {
      input: { id: photoId },
      // pagination은 추후에 구현하자.
      offset: 0,
      limit: 10,
    },
  });

  useEffect(() => {
    setCanSee(canSee);
  }, [canSee, setCanSee]);

  if (!canSee) return <></>;

  return (
    canSee && (
      <>
        <Container ref={parentBox} onClick={toggleVisible}>
          {data && !loading && (
            <>
              <InnerBox>
                <XBox onClick={() => setCanSee(!canSee)}>
                  <FontAwesomeIcon icon={faTimes} size="lg" color="white" />
                </XBox>
                <PhotoBox
                  url={data.seePhotoDetail.photo?.file!}
                  onClick={(e) => e.preventDefault()}
                />
                <ContentWrapper>
                  <ProfileBox>
                    <AvatarAndUsername
                      url={data.seePhotoDetail.photo?.user.avatar}
                      size="lg"
                      username={data.seePhotoDetail.photo?.user.username!}
                      firstName={data.seePhotoDetail.photo?.user.firstName}
                      linkable
                    />
                  </ProfileBox>
                  <ContentBox>
                    <AvatarAndUsername
                      url={data.seePhotoDetail.photo?.user.avatar}
                      size="lg"
                      username={data.seePhotoDetail.photo?.user.username!}
                      firstName={data.seePhotoDetail.photo?.user.firstName}
                      linkable
                    />
                    <SpanCaption>
                      {makeLinkText(data.seePhotoDetail.photo?.caption!)}
                    </SpanCaption>
                    <SpanTimeSince>
                      {timeSince(data.seePhotoDetail.photo?.createdAt)} ago
                    </SpanTimeSince>
                    {data.seePhotoDetail.photo?.comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        payload={comment.payload}
                        commentId={comment.id}
                        user={comment.user}
                        isMine={comment.isMine}
                        photoId={data.seePhotoDetail.photo?.id!}
                      />
                    ))}
                  </ContentBox>
                  <ActionBox>
                    <Actions
                      photoId={data.seePhotoDetail.photo?.id!}
                      isLiked={data.seePhotoDetail.photo?.isLiked!}
                    />
                    <SpanNumLike>
                      좋아요 {data.seePhotoDetail.photo?.numLikes}개
                    </SpanNumLike>
                  </ActionBox>
                  <CommentBox>
                    <WriteComment photoId={photoId} />
                  </CommentBox>
                </ContentWrapper>
              </InnerBox>
            </>
          )}
        </Container>
      </>
    )
  );
};
