import { gql, useQuery } from "@apollo/client";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import {
  QuerySeeProfile,
  QuerySeeProfileVariables,
} from "../codegen/QuerySeeProfile";
import { Avatar } from "../components/Avatar";
import { ToggleFollow } from "../components/FollowButton";
import { LayoutContainer } from "../components/LayoutContainer";
import { PART_USER } from "../fragments";
import { useMe } from "../hooks/useMe";

const GQL_USER = gql`
  query QuerySeeProfile($input: SeeProfileInput!) {
    seeProfile(input: $input) {
      ok
      error
      user {
        ...PartUser
      }
    }
  }
  ${PART_USER}
`;

const Container = styled(LayoutContainer)`
  flex-direction: column;
  align-items: center;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  width: 100%;
`;

const AvatarContainer = styled.div`
  margin-left: 5rem;
  margin-right: 5rem;
`;

const UserContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const UsernameContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const SpanUsername = styled.span`
  font-size: 26px;
  margin-right: 1rem;
  vertical-align: text-bottom;
`;

const ButtonEditProfile = styled.button`
  border: 1px solid ${(props) => props.theme.color.border};
  padding: 5px 8px;
  border-radius: 5px;
`;

const NumberContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const SpanNumber = styled.span`
  &:not(:last-child) {
    margin-right: 2rem;
  }
`;

const SpanName = styled.span``;

const PhotoContainer = styled.div`
  margin-top: 3rem;
  border-top: 1px solid ${(props) => props.theme.color.border};
  padding-top: 3rem;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
`;
const PhotoInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(50, 50, 50, 0.6);
  width: 100%;
  height: 100%;
`;

const PhotoFrame = styled.div<{ file: string }>`
  width: 100%;
  height: 100%;
  border: 1px solid ${(props) => props.theme.color.border};
  aspect-ratio: 1/1;
  overflow: hidden;
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.file});

  ${PhotoInfoContainer} {
    display: none;
  }
  &:hover ${PhotoInfoContainer} {
    display: flex;
  }
`;

const SpanPhotoInfo = styled.span`
  font-weight: 600;
  &:first-child {
    margin-right: 1.5rem;
  }
  color: white;
`;

const IconPhotoInfo = styled(FontAwesomeIcon)`
  margin-right: 5px;
`;

export const UserPage = () => {
  const { username } = useParams<{ username: string }>();
  const { data: me, loading: meLoading } = useMe();
  const { data, loading } = useQuery<QuerySeeProfile, QuerySeeProfileVariables>(
    GQL_USER,
    {
      variables: {
        input: {
          username,
        },
      },
    }
  );
  if (loading || meLoading) {
    return <div>loading...</div>;
  } else {
    const user = data?.seeProfile.user!;

    return (
      <Container>
        <ProfileContainer>
          <AvatarContainer>
            <Avatar size="10x" url={user.avatar} />
          </AvatarContainer>
          <UserContentContainer>
            <UsernameContainer>
              <SpanUsername>{user.username}</SpanUsername>
              {user.id === me?.seeMe.id && (
                <ButtonEditProfile>프로필 편집</ButtonEditProfile>
              )}
              {user.id !== me?.seeMe.id && (
                <ToggleFollow
                  isFollowing={user.isFollowing}
                  authUsername={me?.seeMe.username!}
                  username={user.username}
                />
              )}
            </UsernameContainer>
            <NumberContainer>
              <SpanNumber>게시물 {user.numPhotos}</SpanNumber>
              <SpanNumber>팔로워 {user.totalFollowers}</SpanNumber>
              <SpanNumber>팔로우 {user.totalFollowings}</SpanNumber>
            </NumberContainer>
            <SpanName>{user.firstName}</SpanName>
          </UserContentContainer>
        </ProfileContainer>
        <PhotoContainer>
          {user.photos.map((photo) => (
            <PhotoFrame key={photo.id} file={photo.file}>
              <PhotoInfoContainer>
                <SpanPhotoInfo>
                  <IconPhotoInfo icon={faHeart} />
                  {photo.numLikes}
                </SpanPhotoInfo>
                <SpanPhotoInfo>
                  <IconPhotoInfo icon={faComment} />
                  {photo.numComments}
                </SpanPhotoInfo>
              </PhotoInfoContainer>
            </PhotoFrame>
          ))}
        </PhotoContainer>
      </Container>
    );
  }
};
