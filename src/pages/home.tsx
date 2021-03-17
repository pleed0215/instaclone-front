import { gql, useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";
import { useMe } from "../hooks/useMe";
import { PART_PHOTO } from "../fragments";
import { LayoutContainer } from "../components/LayoutContainer";
import { Loader } from "../components/Loader";
import {
  QuerySeeFeeds,
  QuerySeeFeedsVariables,
} from "../codegen/QuerySeeFeeds";
import { Avatar } from "../components/Avatar";
import { breakpoints, device } from "../theme/theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faComment as farComment,
  faPaperPlane as farPaperPlane,
} from "@fortawesome/free-regular-svg-icons";

import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { Collapse } from "../components/Collapse";

const GQL_FEED = gql`
  query QuerySeeFeeds($input: SeeFeedsInput!) {
    seeFeeds(input: $input) {
      ok
      error
      totalCount
      totalPage
      currentCount
      currentPage
      pageSize
      feeds {
        ...PartPhoto
      }
    }
  }
  ${PART_PHOTO}
`;

const Container = styled(LayoutContainer)`
  min-height: 100vh;
  position: relative;
  justify-content: space-between;
  @media screen and (max-width: ${breakpoints.lg}) {
    justify-content: center;
  }
`;

const MeAndSomeuserContainer = styled.div`
  @media screen and (max-width: ${breakpoints.lg}) {
    display: none;
  }
  display: flex;
  flex-direction: column;
  max-width: 300px;
  width: 100%;
  position: absolute;
  right: 0;
`;

const MeAndSomeUsers = styled.div`
  height: 500px;
  position: fixed;
  max-width: 300px;
  width: 100%;
`;

const PhotoContainer = styled.div`
  ${device.sm} {
    min-width: ${breakpoints.sm};
  }
  ${device.xs} {
    max-width: ${breakpoints.xs};
  }
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: ${breakpoints.sm};
`;

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

export const HomePage = () => {
  const { loading, data, error } = useMe();
  const { loading: loadFeed, data: feeds, error: errorFeed } = useQuery<
    QuerySeeFeeds,
    QuerySeeFeedsVariables
  >(GQL_FEED, {
    variables: {
      input: {
        page: 1,
        pageSize: 10,
      },
    },
  });

  return (
    <Container>
      {loadFeed && <Loader />}
      {!loadFeed && feeds?.seeFeeds.feeds && (
        <PhotoContainer>
          <PhotoItemWrapper />
          {feeds.seeFeeds.feeds.map((feed, index) => (
            <PhotoItemWrapper key={index}>
              <PhotoItemHeader>
                <Avatar url={feed.user.avatar} size="lg" />
                <PhotoItemHeaderUserInfo>
                  <PhotoItemHeaderUsername>
                    {feed.user.username}
                  </PhotoItemHeaderUsername>
                  <PhotoItemHeaderName>
                    {feed.user.firstName}
                  </PhotoItemHeaderName>
                </PhotoItemHeaderUserInfo>
              </PhotoItemHeader>
              <Photo url={feed.file} />
              <PhotoContentContainer>
                <PhotoMenuContainer>
                  <PhotoMenuItem icon={farHeart} size="2x" />
                  <PhotoMenuItem icon={farPaperPlane} size="2x" />
                  <PhotoMenuItem icon={farComment} size="2x" />
                </PhotoMenuContainer>
                <SpanNumLike>좋아요 {feed.numLikes}개</SpanNumLike>
                <span style={{ fontWeight: "bold" }}>{feed.user.username}</span>
                <Collapse collapsed={true} text={"...더보기"}>
                  <span>{feed.caption}</span>
                </Collapse>
                <ButtonSeeMoreComment>
                  댓글 {feed.numComments}개 더 보기
                </ButtonSeeMoreComment>
              </PhotoContentContainer>
            </PhotoItemWrapper>
          ))}
        </PhotoContainer>
      )}

      <MeAndSomeuserContainer>
        <MeAndSomeUsers>
          <span>Hello</span>
        </MeAndSomeUsers>
      </MeAndSomeuserContainer>
    </Container>
  );
};
