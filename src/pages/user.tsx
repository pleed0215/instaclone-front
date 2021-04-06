import { gql, useMutation, useQuery } from "@apollo/client";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  MutationUpdateAvatar,
  MutationUpdateAvatarVariables,
} from "../codegen/MutationUpdateAvatar";
import {
  QuerySeeProfile,
  QuerySeeProfileVariables,
} from "../codegen/QuerySeeProfile";
import { Avatar } from "../components/Avatar";
import { ToggleFollow } from "../components/FollowButton";
import { HelmetOnlyTitle } from "../components/HelmetOnlyTitle";
import { LayoutContainer } from "../components/LayoutContainer";
import { PhotoDetail } from "../components/PhotoDetail";
import { PART_USER } from "../fragments";
import { GQL_ME, useMe } from "../hooks/useMe";

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

const GQL_UPDATE_AVATAR = gql`
  mutation MutationUpdateAvatar($file: Upload!, $id: Int!) {
    updateProfile(input: { id: $id, avatar: $file }) {
      ok
      error
    }
  }
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
  position: relative;
`;

const AvatarContainer = styled.button`
  margin-left: 5rem;
  margin-right: 5rem;
  position: relative;
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

const ButtonEditProfile = styled(Link)`
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
const PhotoInfoContainer = styled.button`
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

const AvatarMenu = styled.button`
  background-color: rgb(230, 230, 230);
  color: blue;
  text-align: center;
  position: absolute;
  bottom: -45px;
  width: 200px;
  left: 100px;
  padding: 10px;
  border-radius: 8px;
  &:before {
    content: "";
    height: 5px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid rgb(230, 230, 230);
    border-top: 5px solid none;
    position: absolute;
    top: -10px;
    left: 40px;
  }
`;

const SpanPhotoInfo = styled.span`
  font-weight: 600;
  &:first-child {
    margin-right: 1.5rem;
  }
  color: white;
`;

const IconPhotoInfo = styled(FontAwesomeIcon)<{ color: string }>`
  margin-right: 5px;
  &:svg {
    color: ${(props) => props.color};
  }
`;

export const UserPage = () => {
  const [canSee, setCanSee] = useState(false);
  const [seeMenu, setSeeMenu] = useState(false);
  const [photoId, setPhotoId] = useState(0);
  const { username } = useParams<{ username: string }>();
  const avatarMenu = useRef<HTMLButtonElement>(null);

  const fileInput = useRef<HTMLInputElement>(null);

  const { data: me, loading: meLoading } = useMe();
  const [updateAvatar] = useMutation<
    MutationUpdateAvatar,
    MutationUpdateAvatarVariables
  >(GQL_UPDATE_AVATAR);
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
  const onPhotoClick = (id: number) => () => {
    setPhotoId(id);
    setCanSee(true);
  };
  const onAvatarMenuClick = () => {
    setSeeMenu(!seeMenu);
  };
  const onBlurAvatar = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (e.relatedTarget !== avatarMenu.current) {
      setSeeMenu(false);
    }
  };
  const onAvatarChangeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (fileInput.current) fileInput.current.click();
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (me && files && files.length > 0) {
      const file = files[0];

      updateAvatar({
        variables: {
          id: me?.seeMe.id,
          file,
        },
        refetchQueries: [
          {
            query: GQL_ME,
          },
        ],
      });
    }
    setSeeMenu(false);
  };

  if (loading || meLoading) {
    return <div>loading...</div>;
  } else {
    const user = data?.seeProfile.user!;

    return (
      <Container>
        <HelmetOnlyTitle title={`${user.username}'s page`} />
        <ProfileContainer>
          <AvatarContainer onClick={onAvatarMenuClick} onBlur={onBlurAvatar}>
            <Avatar size="10x" url={user?.avatar} />
          </AvatarContainer>
          {seeMenu && user?.id === me?.seeMe.id && (
            <AvatarMenu ref={avatarMenu} onClick={onAvatarChangeClick}>
              아바타 변경
              <input
                type="file"
                accept="image/jpeg"
                ref={fileInput}
                style={{ display: "none" }}
                onChange={onFileSelect}
              />
            </AvatarMenu>
          )}
          <UserContentContainer>
            <UsernameContainer>
              <SpanUsername>{user?.username}</SpanUsername>
              {user?.id === me?.seeMe.id && (
                <ButtonEditProfile to="/edit-me">프로필 편집</ButtonEditProfile>
              )}
              {user?.id !== me?.seeMe.id && (
                <ToggleFollow
                  isFollowing={user.isFollowing}
                  authUsername={me?.seeMe.username!}
                  username={user.username}
                />
              )}
            </UsernameContainer>
            <NumberContainer>
              <SpanNumber>게시물 {user?.numPhotos}</SpanNumber>
              <SpanNumber>팔로워 {user?.totalFollowers}</SpanNumber>
              <SpanNumber>팔로우 {user?.totalFollowings}</SpanNumber>
            </NumberContainer>
            <SpanName>{user?.firstName}</SpanName>
          </UserContentContainer>
        </ProfileContainer>
        <PhotoContainer>
          {user?.photos.map((photo) => (
            <PhotoFrame key={photo.id} file={photo.file}>
              <PhotoDetail
                photoId={photoId}
                canSee={canSee}
                setCanSee={setCanSee}
              />
              <PhotoInfoContainer onClick={onPhotoClick(photo.id)}>
                <SpanPhotoInfo>
                  <IconPhotoInfo icon={faHeart} color="white" />
                  {photo.numLikes}
                </SpanPhotoInfo>
                <SpanPhotoInfo>
                  <IconPhotoInfo icon={faComment} color="white" />
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
