import { gql, useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import { PART_PHOTO } from "../fragments";
import { LayoutContainer } from "../components/LayoutContainer";
import { Loader } from "../components/Loader";
import {
  QuerySeeFeeds,
  QuerySeeFeedsVariables,
} from "../codegen/QuerySeeFeeds";
import { breakpoints, device } from "../theme/theme";

import { PhotoItem } from "../components/PhotoItem";
import { HelmetOnlyTitle } from "../components/HelmetOnlyTitle";
import { AvatarAndUsername } from "../components/Avatar";
import { useMe } from "../hooks/useMe";

const GQL_FEED = gql`
  query QuerySeeFeeds($input: SeeFeedsInput!) {
    seeFeeds(input: $input) {
      ...PartPhoto
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
  display: relative;
`;

export const HomePage = () => {
  const { loading: loadFeed, data: feeds } = useQuery<
    QuerySeeFeeds,
    QuerySeeFeedsVariables
  >(GQL_FEED, {
    variables: {
      input: {
        offset: 0,
        limit: 10,
      },
    },
  });
  const { data: me } = useMe();

  return (
    <Container>
      <HelmetOnlyTitle title={"Feed"} />
      {loadFeed && <Loader />}
      {!loadFeed && feeds?.seeFeeds && (
        <PhotoContainer>
          <PhotoItemWrapper />
          {feeds.seeFeeds.map((feed) => (
            <PhotoItem key={feed.id} photo={feed} />
          ))}
        </PhotoContainer>
      )}

      <MeAndSomeuserContainer>
        <MeAndSomeUsers>
          {me && (
            <AvatarAndUsername
              url={me?.seeMe.avatar}
              username={me?.seeMe.username}
              firstName={me?.seeMe.firstName}
              linkable
              size="3x"
            />
          )}
        </MeAndSomeUsers>
      </MeAndSomeuserContainer>
    </Container>
  );
};
