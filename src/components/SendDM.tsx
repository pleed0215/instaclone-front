import { useLazyQuery, useMutation } from "@apollo/client";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, FormEvent, useState } from "react";
import styled from "styled-components";
import {
  MutationSendMessage,
  MutationSendMessageVariables,
} from "../codegen/MutationSendMessage";
import { GQL_SEND_MESSAGE, GQL_SEE_ROOMS } from "../pages/dm.rooms";
import {
  QuerySearchUsers,
  QuerySearchUsersVariables,
  QuerySearchUsers_searchUser,
} from "../codegen/QuerySearchUsers";
import { QuerySeeMe_seeMe } from "../codegen/QuerySeeMe";
import { useMe } from "../hooks/useMe";
import { GQL_SEARCH_USERS } from "../pages/search";
import { Avatar } from "./Avatar";
import { ButtonInactivable } from "./ButtonInactivable";
import { ToggleFollow } from "./FollowButton";
import { Loader } from "./Loader";

const Container = styled.div`
  width: 250px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: -20px;
  top: 30px;
  background-color: ${(props) => props.theme.background.primary};
  padding: 10px;
  border: 1px solid ${(props) => props.theme.color.border};
  cursor: default;
  &:before {
    content: "";
    height: 5px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid ${(props) => props.theme.color.border};
    border-top: 5px solid none;
    position: absolute;
    top: -10px;
    left: 30px;
  }
  z-index: 10;
`;

const SearchInputBox = styled.form`
  width: 100%;

  display: flex;
  align-items: center;
`;

const SearchResultBox = styled.div`
  width: 100%;
  border: 1px solid ${(props) => props.theme.color.border};
  background-color: ${(props) => props.theme.background.secondary};
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  min-height: 150px;
  max-height: 150px;
  overflow-y: scroll;

  --ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SearchInput = styled.input`
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 4px;
  width: 100%;
  position: relative;
  padding: 5px 10px 5px 30px;
  background-color: rgb(240, 240, 240);
  &:focus {
    outline: none;
  }
`;

const UserBox = styled.div`
  padding: 5px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14;
  border-bottom: "1px solid ${(props) => props.theme.color.border}";
`;

const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MessageInputBox = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const MessageInput = styled.input`
  border-radius: 8px;
  margin-right: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

const RenderUser: React.FC<{
  user: QuerySearchUsers_searchUser;
  me: QuerySeeMe_seeMe;
  setToUser: React.Dispatch<QuerySearchUsers_searchUser>;
}> = ({ user, me, setToUser }) => {
  if (user.id === me.id) {
    return <></>;
  } else {
    return (
      <UserBox>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input type="radio" name="who" onChange={(e) => setToUser(user)} />
          <Avatar url={user.avatar} size="lg" />
          <span style={{ fontSize: 12, marginLeft: 5 }}>{user.username}</span>
        </div>

        <div style={{ width: 70 }}>
          <ToggleFollow
            authUsername={me.username}
            isFollowing={user.isFollowing}
            username={user.username}
          />
        </div>
      </UserBox>
    );
  }
};

interface SeeDMProp {
  onClose: () => void;
}

export const SendDM: React.FC<SeeDMProp> = ({ onClose }) => {
  const [find, setFind] = useState("");
  const [searchUser, { data: users, loading: searching }] = useLazyQuery<
    QuerySearchUsers,
    QuerySearchUsersVariables
  >(GQL_SEARCH_USERS);
  const [toUser, setToUser] = useState<QuerySearchUsers_searchUser>();
  const [message, setMessage] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFind(e.target.value);
    if (e.target.value !== "" && e.target.value.length > 3) {
      searchUser({
        variables: {
          input: {
            keyword: find,
            offset: 0,
            limit: 10,
          },
        },
      });
    }
  };
  const [loading, setLoading] = useState(false);
  const [sendMessage] = useMutation<
    MutationSendMessage,
    MutationSendMessageVariables
  >(GQL_SEND_MESSAGE, {
    onCompleted: () => {
      setLoading(false);
      onClose();
    },
  });
  const { data: me } = useMe();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message !== "" && toUser) {
      setLoading(true);
      sendMessage({
        variables: {
          input: {
            userId: toUser.id,
            payload: message,
          },
        },
        refetchQueries: [
          {
            query: GQL_SEE_ROOMS,
          },
        ],
      });
    }
  };

  return (
    <Container>
      {me && (
        <>
          <SearchInputBox>
            <SearchInput value={find} onChange={onChange} />
            <FontAwesomeIcon
              icon={faUser}
              color="gray"
              style={{ position: "absolute", left: 20 }}
            />
          </SearchInputBox>

          <SearchResultBox>
            {searching && (
              <div
                style={{
                  width: "100%",
                  minHeight: 150,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loader />
                <span style={{ marginLeft: 10 }}>찾는 중...</span>
              </div>
            )}
            {users &&
              !searching &&
              users.searchUser.map((user) => (
                <RenderUser
                  key={`User:${user.id}`}
                  user={user}
                  me={me.seeMe}
                  setToUser={setToUser}
                />
              ))}
          </SearchResultBox>
        </>
      )}
      {toUser && (
        <MessageBox>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 10,
              marginBottom: 10,
              fontSize: 14,
            }}
          >
            <span style={{ marginRight: 10 }}>To:&nbsp;</span>
            <Avatar url={toUser.avatar} size="lg" />
            <span style={{ marginLeft: 10 }}>{toUser.username}</span>
          </div>
          <MessageInputBox onSubmit={onSubmit}>
            <MessageInput
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div style={{ width: 70 }}>
              <ButtonInactivable loading={false} isActivate={!loading}>
                보내기
              </ButtonInactivable>
            </div>
          </MessageInputBox>
        </MessageBox>
      )}
    </Container>
  );
};
