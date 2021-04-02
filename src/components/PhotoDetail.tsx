import { gql, useQuery } from "@apollo/client";
import { faCross, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import {
  QueryPhotoDetail,
  QueryPhotoDetailVariables,
} from "../codegen/QueryPhotoDetail";
import {
  PART_COMMENT,
  SMALL_PART_COMMENT,
  SMALL_PART_PHOTO,
} from "../fragments";
import { LayoutContainer } from "./LayoutContainer";

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
  height: 70vh;
  background-color: blue;
  flex-direction: row;
  justify-content: flex-start;
  z-index: 20;
  position: relative;
`;

const PhotoBox = styled.div<{ url: string }>`
  max-width: 600px;
  width: 100%;
  background-position: center center;
  background-image: url(${(props) => props.url});
  background-size: cover;
  border: 1px solid ${(props) => props.theme.color.border};
`;

const ContentBox = styled.div`
  padding: 10px;
  overflow-y: auto;
`;
const ContentAndComment = styled.div``;
const ActionBox = styled.div``;
const CommentBox = styled.div``;

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
  const theme = useTheme();

  useEffect(() => {
    setCanSee(canSee);
  }, []);

  if (!canSee) return <></>;

  return (
    canSee && (
      <>
        <Container ref={parentBox} onClick={toggleVisible}>
          {data && !loading && (
            <>
              <InnerBox>
                <XBox onClick={() => setCanSee(!canSee)}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    size="lg"
                    color={theme.color.primary}
                  />
                </XBox>
                <PhotoBox
                  url={data.seePhotoDetail.photo?.file!}
                  onClick={(e) => e.preventDefault()}
                />
              </InnerBox>
            </>
          )}
        </Container>
      </>
    )
  );
};
