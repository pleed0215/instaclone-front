import { gql, useQuery } from "@apollo/client";
import React from "react";
import styled, { useTheme } from "styled-components";

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
import { Footer } from "../components/Footer";
import { ToggleFollow } from "../components/FollowButton";
import { GQL_SEARCH_USERS } from "./search";
import {
  QuerySearchUsers,
  QuerySearchUsersVariables,
} from "../codegen/QuerySearchUsers";

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
  const theme = useTheme();
  const { data: recommend } = useQuery<
    QuerySearchUsers,
    QuerySearchUsersVariables
  >(GQL_SEARCH_USERS, { variables: { input: { keyword: "", limit: 10 } } });

  return (
    <Container>
      <HelmetOnlyTitle title={"Feed"} />
      {loadFeed && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      )}
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
          {me && recommend && (
            <>
              <AvatarAndUsername
                url={me?.seeMe.avatar}
                username={me?.seeMe.username}
                firstName={me?.seeMe.firstName}
                linkable
                size="3x"
              />
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: theme.color.border,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
              <span style={{ fontSize: 14, marginBottom: 10 }}>추천친구</span>
              {recommend.searchUser.map(
                (user) =>
                  user.id !== me.seeMe.id && (
                    <div
                      key={`Recommend:${user.id}`}
                      style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <AvatarAndUsername
                        linkable
                        username={user.username}
                        url={user.avatar}
                        firstName={user.firstName}
                        size="lg"
                      />
                      <div style={{ minWidth: 80, maxWidth: 80 }}>
                        <ToggleFollow
                          authUsername={me.seeMe.username}
                          username={user.username}
                          isFollowing={user.isFollowing}
                        />
                      </div>
                    </div>
                  )
              )}
            </>
          )}
          <Footer />
        </MeAndSomeUsers>
      </MeAndSomeuserContainer>
    </Container>
  );
};
