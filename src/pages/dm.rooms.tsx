import {
  gql,
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import styled, { css } from "styled-components";
import { LayoutContainer } from "../components/LayoutContainer";
import { useMe } from "../hooks/useMe";
import { PART_MESSAGE, PART_ROOM } from "../fragments";
import {
  QuerySeeRooms,
  QuerySeeRooms_seeRooms_rooms,
  QuerySeeRooms_seeRooms_rooms_participants,
} from "../codegen/QuerySeeRooms";
import { Avatar, AvatarAndUsername } from "../components/Avatar";
import { QuerySeeMe_seeMe } from "../codegen/QuerySeeMe";
import {
  QueryGetMessages,
  QueryGetMessagesVariables,
  QueryGetMessages_fetchAndReadMessages,
  QueryGetMessages_fetchAndReadMessages_messages,
} from "../codegen/QueryGetMessages";

import { timeSince } from "../utils";
import {
  MutationSendMessage,
  MutationSendMessageVariables,
  MutationSendMessage_sendMessage_message,
} from "../codegen/MutationSendMessage";
import { WaitMessage, WaitMessageVariables } from "../codegen/WaitMessage";

const GQL_SEE_ROOMS = gql`
  query QuerySeeRooms {
    seeRooms {
      ok
      error
      rooms {
        ...PartRoom
      }
    }
  }
  ${PART_ROOM}
`;

const GQL_GET_MESSAGE = gql`
  query QueryGetMessages($input: FetchMessagesInput!) {
    fetchAndReadMessages(input: $input) {
      ok
      error
      messages {
        ...PartMessage
      }
    }
  }
  ${PART_MESSAGE}
`;

const GQL_WAIT_MESSAGE = gql`
  subscription WaitMessage($roomId: Int!) {
    waitNewMessage(roomId: $roomId) {
      ...PartMessage
    }
  }
  ${PART_MESSAGE}
`;

const GQL_SEND_MESSAGE = gql`
  mutation MutationSendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      ok
      error
      message {
        ...PartMessage
      }
    }
  }
  ${PART_MESSAGE}
`;

const Container = styled(LayoutContainer)`
  background-color: ${(props) => props.theme.background.secondary};
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
`;

const ListWrapper = styled.div`
  min-width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.color.border};
  border-right: none;
`;

const ListHeader = styled.div`
  min-height: 60px;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.color.border};
  padding: 0px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SpanUsername = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const ListBox = styled.div`
  width: 100%;
  min-height: calc(80vh - 62px);
`;

const ContentWrapper = styled.div`
  min-width: 70%;
  height: 100%;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.color.border};
`;
const ContentHeader = styled.div`
  min-height: 60px;
  max-height: 60px;
  width: 100%;

  border-bottom: 1px solid ${(props) => props.theme.color.border};
`;
const ContentBox = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(80vh - 62px);
  display: flex;
  flex-direction: column;
`;

const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  overflow-y: scroll;
  width: 100%;
  min-height: calc(70vh - 62px);
  max-height: calc(70vh - 62px);

  --ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const WritingBox = styled.form`
  min-height: calc(10vh);
  max-height: calc(10vh);

  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const Input = styled.textarea`
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.color.border};
  resize: none;
  background-color: ${(props) => props.theme.background.primary};
  width: 100%;
  margin-right: 10px;
  &:focus {
    outline: none;
  }
  color: ${(props) => props.theme.color.primary};
  padding: 5px 10px;
`;

const RoomContainer = styled.div<{ selected: boolean }>`
  ${(props) =>
    props.selected &&
    css`
      background-color: ${props.theme.background.primary};
    `};
  padding: 10px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: ${(props) => props.theme.background.primary};
  }
  transition: background-color 0.3s ease-in;
  cursor: pointer;
`;

const SpanUnread = styled.span`
  font-size: 13px;
`;

const MessageItemBox = styled.div<{ isMine: boolean }>`
  max-width: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  ${(props) =>
    props.isMine &&
    css`
      flex-direction: row-reverse;
      align-self: flex-end;
    `};
`;

const MessageItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 6px;
  margin-right: 6px;
`;
const MessageItemProfile = styled.div``;
const MessageItemPayload = styled.div<{ isMine: boolean }>`
  width: 100%;
  padding: 7px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.isMine ? "gold" : props.theme.background.primary};
  color: ${(props) => (props.isMine ? "black" : props.theme.color.primary)};
  border: 1px solid ${(props) => props.theme.color.border};
  font-size: 13px;
  font-weight: 600;
`;

const Button = styled.button<{ isActive?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-width: min-content;
  height: 32px;
  ${(props) =>
    !props.isActive &&
    css`
      pointer-events: none;
    `};
  background-color: ${(props) => (props.isActive ? "#4795f6" : "#B2DFFC")};
  color: white;
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: 3px;
`;

interface DMRoomInfo {
  roomId: number;
  with: QuerySeeRooms_seeRooms_rooms_participants;
}

const RenderRoom: React.FC<{
  room: QuerySeeRooms_seeRooms_rooms;
  me: QuerySeeMe_seeMe;
  setRoomInfo: React.Dispatch<DMRoomInfo>;
  roomInfo?: DMRoomInfo;
}> = ({ room, me, setRoomInfo, roomInfo }) => {
  const { username } = useParams<{ username: string }>();
  const u = room.participants.find((user) => user.id !== me.id);

  return (
    <RoomContainer
      selected={u?.username === username || room.id === roomInfo?.roomId}
      onClick={() => setRoomInfo({ roomId: room.id, with: u! })}
    >
      {u && (
        <>
          <AvatarAndUsername
            username={u?.username}
            firstName={u?.firstName}
            url={u?.avatar}
            size="lg"
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            {room.numUnread !== 0 && (
              <>
                <div
                  style={{
                    width: 5,
                    height: 5,
                    backgroundColor: "red",
                    borderRadius: "50%",
                    marginRight: 3,
                  }}
                />
                <SpanUnread>{room.numUnread} 안읽음</SpanUnread>
              </>
            )}
          </div>
        </>
      )}
    </RoomContainer>
  );
};

const WaitNewMessage: React.FC<{ roomId: number }> = ({ roomId }) => {
  useSubscription<WaitMessage, WaitMessageVariables>(GQL_WAIT_MESSAGE, {
    skip: true,
    variables: {
      roomId,
    },
    onSubscriptionData({ client, subscriptionData }) {
      console.log(subscriptionData);
      client.cache.modify({
        id: "ROOT_QUERY",
        fields: {
          fetchAndReadMessages(prev: QueryGetMessages_fetchAndReadMessages) {
            const prevMessages = prev.messages ? prev.messages.slice(0) : [];

            if (
              prevMessages.some(
                (m) => m.id === subscriptionData.data?.waitNewMessage?.id
              )
            ) {
              return prev;
            } else {
              return {
                ok: true,
                error: null,
                messages: [
                  subscriptionData.data?.waitNewMessage,
                  ...prevMessages,
                ],
              };
            }
          },
        },
      });
    },
  });
  return <div></div>;
};

export const DMRooms = () => {
  const { data: me, loading: meLoading } = useMe();
  const { data: rooms, loading: roomsLoading } = useQuery<QuerySeeRooms>(
    GQL_SEE_ROOMS
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const [fetchMessages, { data: messages }] = useLazyQuery<
    QueryGetMessages,
    QueryGetMessagesVariables
  >(GQL_GET_MESSAGE);
  const [roomInfo, setRoomInfo] = useState<DMRoomInfo>();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const chatboxToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };
  const [sendMessage] = useMutation<
    MutationSendMessage,
    MutationSendMessageVariables
  >(GQL_SEND_MESSAGE, {
    onCompleted: () => {
      setMsg("");
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      chatboxToBottom();
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (msg !== "") {
      setLoading(true);
      sendMessage({
        variables: {
          input: {
            roomId: roomInfo?.roomId,
            userId: roomInfo?.with.id,
            payload: msg,
          },
        },
        update(cache, result) {
          cache.modify({
            id: "ROOT_QUERY",
            fields: {
              fetchAndReadMessages(
                prev: QueryGetMessages_fetchAndReadMessages
              ) {
                const safeMsgs = prev.messages ? prev.messages.slice(0) : [];
                const { data } = result;

                if (
                  safeMsgs.some(
                    (m: QueryGetMessages_fetchAndReadMessages_messages) =>
                      m.id === data?.sendMessage?.message?.id
                  )
                ) {
                  return prev;
                } else {
                  return {
                    ok: true,
                    error: null,
                    messages: [result.data?.sendMessage.message, ...safeMsgs],
                  };
                }
              },
            },
          });
        },
      });
    }
  };

  const onEnterSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  useEffect(() => {
    if (roomInfo) {
      fetchMessages({
        variables: {
          input: {
            roomId: roomInfo?.roomId!,
            pageSize: 50,
          },
        },
      });
    }
  }, [roomInfo]);

  useSubscription<WaitMessage, WaitMessageVariables>(GQL_WAIT_MESSAGE, {
    skip: !Boolean(roomInfo),
    variables: {
      roomId: roomInfo?.roomId!,
    },
    onSubscriptionData({ client, subscriptionData }) {
      client.cache.modify({
        id: "ROOT_QUERY",
        fields: {
          fetchAndReadMessages(prev: QueryGetMessages_fetchAndReadMessages) {
            const prevMessages = prev.messages ? prev.messages.slice(0) : [];

            if (
              prevMessages.some(
                (m) => m.id === subscriptionData.data?.waitNewMessage?.id
              )
            ) {
              return prev;
            } else {
              return {
                ok: true,
                error: null,
                messages: [
                  subscriptionData.data?.waitNewMessage,
                  ...prevMessages,
                ],
              };
            }
          },
        },
      });
    },
    onSubscriptionComplete() {
      chatboxToBottom();
    },
  });

  if (meLoading || roomsLoading) {
    return <></>;
  } else {
    return (
      <Container>
        <ListWrapper>
          <ListHeader>
            <div />
            <SpanUsername>{me?.seeMe.username}</SpanUsername>
            <button>
              <FontAwesomeIcon icon={faEdit} size="lg" />
            </button>
          </ListHeader>
          <ListBox>
            {rooms?.seeRooms.rooms?.map((room) => (
              <RenderRoom
                key={`Room:${room.id}`}
                room={room}
                me={me?.seeMe!}
                setRoomInfo={setRoomInfo}
                roomInfo={roomInfo}
              />
            ))}
          </ListBox>
        </ListWrapper>
        <ContentWrapper>
          {roomInfo && messages && (
            <>
              <ContentHeader>
                <AvatarAndUsername
                  linkable
                  username={roomInfo?.with.username}
                  url={roomInfo.with.avatar}
                  firstName={roomInfo.with.firstName}
                  size="lg"
                />
              </ContentHeader>
              <ContentBox>
                <MessageBox ref={chatboxRef}>
                  {messages.fetchAndReadMessages.messages
                    ?.slice(0)
                    .reverse()
                    .map((message) => (
                      <MessageItemBox
                        key={message.id}
                        isMine={message.user.id === me?.seeMe.id}
                      >
                        <div>
                          <Avatar size="lg" url={message.user.avatar} />
                        </div>
                        <MessageItem>
                          <MessageItemProfile>
                            <span style={{ fontSize: "12px" }}>
                              {message.user.username} /{" "}
                              {timeSince(message.createdAt)} ago
                            </span>
                          </MessageItemProfile>
                          <MessageItemPayload
                            isMine={message.user.id === me?.seeMe.id}
                          >
                            {message.payload}
                          </MessageItemPayload>
                        </MessageItem>
                      </MessageItemBox>
                    ))}
                </MessageBox>
                <WritingBox onSubmit={onSubmit}>
                  <Input
                    ref={inputRef}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyPress={onEnterSubmit}
                  />
                  <div
                    style={{
                      width: 100,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button ref={buttonRef} isActive={!loading && msg !== ""}>
                      보내기
                    </Button>
                  </div>
                </WritingBox>
              </ContentBox>
            </>
          )}
          {!roomInfo && (
            <>
              <ContentHeader />
              <ContentBox />
            </>
          )}
        </ContentWrapper>
      </Container>
    );
  }
};
