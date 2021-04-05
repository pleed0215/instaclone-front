import { gql, useQuery } from "@apollo/client";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import {
  QuerySearchHashtag,
  QuerySearchHashtagVariables,
  QuerySearchHashtag_searchHashtags,
} from "../codegen/QuerySearchHashtag";
import {
  QuerySearchPhotos,
  QuerySearchPhotosVariables,
} from "../codegen/QuerySearchPhotos";
import {
  QuerySearchUsers,
  QuerySearchUsersVariables,
  QuerySearchUsers_searchUser,
} from "../codegen/QuerySearchUsers";
import { QuerySeeMe_seeMe } from "../codegen/QuerySeeMe";
import { AvatarAndUsername } from "../components/Avatar";
import { ToggleFollow } from "../components/FollowButton";
import { LayoutContainer } from "../components/LayoutContainer";
import { Loader } from "../components/Loader";
import { PhotoItem } from "../components/PhotoItem";
import { PART_PHOTO, PART_USER } from "../fragments";
import { useMe } from "../hooks/useMe";
import { useQueryParam } from "../hooks/useQueryParams";

const GQL_SEARCH_PHOTOS = gql`
  query QuerySearchPhotos($input: SearchPhotoInput!) {
    searchPhotos(input: $input) {
      ...PartPhoto
    }
  }
  ${PART_PHOTO}
`;

const GQL_SEARCH_USERS = gql`
  query QuerySearchUsers($input: SearchUserInput!) {
    searchUser(input: $input) {
      ...PartUser
    }
  }
  ${PART_USER}
`;

const GQL_SEARCH_HASHTAG = gql`
  query QuerySearchHashtag($input: SeeHashTagInput!) {
    searchHashtags(input: $input) {
      id
      hashtag
      numPhotos
    }
  }
`;

const Container = styled(LayoutContainer)`
  flex-direction: column;
  justify-content: flex-start;
`;

const SpanSearchTerm = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const SearchHashtagsBox = styled.div`
  padding: 20px;
  border: 1px solid ${(props) => props.theme.color.border};
  display: flex;
  flex-direction: column;
  justify-content: felx-start;
  border-radius: 8px;
  width: 100%;
  height: auto;
  margin-bottom: 20px;
`;

const HashtagItemBox = styled.div`
  display: flex;
  align-items: center;
`;

const SearchUsersBox = styled.div`
  padding: 20px;
  border: 1px solid ${(props) => props.theme.color.border};
  display: flex;
  flex-direction: column;
  justify-content: felx-start;
  border-radius: 8px;
  width: 100%;
  height: auto;
  margin-bottom: 20px;
`;
const SearchPhotosBox = styled.div`
  padding: 20px;
  border: 1px solid ${(props) => props.theme.color.border};
  display: flex;
  flex-direction: column;
  justify-content: felx-start;
  border-radius: 8px;
  width: 100%;
  height: auto;
`;

interface HashtagItemProp {
  hashtag: QuerySearchHashtag_searchHashtags;
}

const HashtagItem: React.FC<HashtagItemProp> = ({ hashtag }) => {
  const theme = useTheme();
  return (
    <HashtagItemBox>
      <FontAwesomeIcon
        icon={faHashtag}
        size="lg"
        color={theme.color.primary}
        style={{ marginRight: 10 }}
      />
      <Link to={`/hashtags/${hashtag.hashtag}`}>
        <span>{hashtag.hashtag}</span>
        <span>{hashtag.numPhotos}</span>
      </Link>
    </HashtagItemBox>
  );
};

interface UserItemProp {
  user: QuerySearchUsers_searchUser;
  me: QuerySeeMe_seeMe;
}

const UserItemBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.3s ease-in-out;
  padding: 0px 10px;
  border-radius: 8px;
  &:hover {
    background-color: rgba(200, 200, 200, 0.7);
  }
`;

const UserItem: React.FC<UserItemProp> = ({ user, me }) => {
  return (
    <UserItemBox>
      <AvatarAndUsername
        username={user.username}
        url={user.avatar}
        firstName={user.firstName}
        linkable
        size="lg"
      />
      {user.id !== me.id && (
        <div style={{ width: 150 }}>
          <ToggleFollow
            authUsername={me.username}
            isFollowing={user.isFollowing}
            username={user.username}
          />
        </div>
      )}
    </UserItemBox>
  );
};

export const SearchPage = () => {
  const params = useQueryParam().get("term");
  const { data: me } = useMe();

  const { data: hashtags, loading: hashtagLoading } = useQuery<
    QuerySearchHashtag,
    QuerySearchHashtagVariables
  >(GQL_SEARCH_HASHTAG, { variables: { input: { hashtag: params! } } });
  const { data: users, loading: usersLoading } = useQuery<
    QuerySearchUsers,
    QuerySearchUsersVariables
  >(GQL_SEARCH_USERS, { variables: { input: { keyword: params! } } });
  const { data: photos, loading: photosLoading } = useQuery<
    QuerySearchPhotos,
    QuerySearchPhotosVariables
  >(GQL_SEARCH_PHOTOS, {
    variables: { input: { keyword: params!, offset: 0 } },
  });

  if (params && hashtags && users && photos && me) {
    console.log(hashtags);
    return (
      <Container>
        <SpanSearchTerm>검색 결과: '{params}'</SpanSearchTerm>
        <SpanSearchTerm style={{ marginBottom: 10 }}>
          해쉬태그 검색 결과
        </SpanSearchTerm>
        <SearchHashtagsBox>
          {hashtags.searchHashtags.length === 0 && (
            <span>'{params}'가 포함되는 해쉬태그가 없습니다.</span>
          )}
          {hashtags.searchHashtags.length > 0 &&
            hashtags.searchHashtags.map((hashtag) => (
              <HashtagItem key={`Hashtag:${hashtag.id}`} hashtag={hashtag} />
            ))}
        </SearchHashtagsBox>
        <SpanSearchTerm style={{ marginBottom: 10 }}>
          유저 검색 결과
        </SpanSearchTerm>
        <SearchUsersBox>
          {users.searchUser?.length === 0 && (
            <span>'{params}'가 포함되는 유저를 찾을 수 없습니다.</span>
          )}
          {users.searchUser!.length > 0 &&
            users.searchUser?.map((user) => (
              <UserItem user={user} me={me.seeMe} key={`User:${user.id}`} />
            ))}
        </SearchUsersBox>
        <SpanSearchTerm style={{ marginBottom: 10 }}>
          사진 검색 결과
        </SpanSearchTerm>
        <SearchPhotosBox>
          {photos.searchPhotos?.length === 0 && (
            <span>'{params}'가 포함되는 사진을 찾을 수 없습니다.</span>
          )}
          {photos.searchPhotos!.length > 0 &&
            photos.searchPhotos?.map((photo) => (
              <PhotoItem photo={photo} key={`Photo:${photo.id}`} />
            ))}
        </SearchPhotosBox>
      </Container>
    );
  } else if (hashtagLoading || usersLoading || photosLoading) {
    return <Loader />;
  } else {
    return <div>검색어를 입력하여 검색 바랍니다.</div>;
  }
};
