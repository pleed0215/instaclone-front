import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled, { css } from "styled-components";
import { LayoutContainer } from "../components/LayoutContainer";
import { useMe } from "../hooks/useMe";
import { PART_MESSAGE, PART_ROOM } from "../fragments";
import {
  QuerySeeRooms,
  QuerySeeRooms_seeRooms_rooms,
} from "../codegen/QuerySeeRooms";
import { AvatarAndUsername } from "../components/Avatar";
import { QuerySeeMe_seeMe } from "../codegen/QuerySeeMe";
import {
  QueryGetMessages,
  QueryGetMessagesVariables,
} from "../codegen/QueryGetMessages";

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
  width: 100%;

  border-bottom: 1px solid ${(props) => props.theme.color.border};
`;
const ContentBox = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(80vh - 62px);
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
`;

const SpanUnread = styled.span`
  font-size: 13px;
`;

const RenderRoom: React.FC<{
  room: QuerySeeRooms_seeRooms_rooms;
  me: QuerySeeMe_seeMe;
}> = ({ room, me }) => {
  const { username } = useParams<{ username: string }>();
  const u = room.participants.find((user) => user.id !== me.id);

  return (
    <RoomContainer selected={u?.username === username}>
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

export const DMRooms = () => {
  const { data: me, loading: meLoading } = useMe();
  const { data: rooms, loading: roomsLoading } = useQuery<QuerySeeRooms>(
    GQL_SEE_ROOMS
  );

  const [chatWith, setChatWith] = useState(0);
  const [fetchMessages] = useLazyQuery<
    QueryGetMessages,
    QueryGetMessagesVariables
  >(GQL_GET_MESSAGE);

  useEffect(() => {
    fetchMessages({
      variables: {
        input: {
          roomId: chatWith,
        },
      },
    });
  }, [chatWith]);

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
              <RenderRoom key={`Room:${room.id}`} room={room} me={me?.seeMe!} />
            ))}
          </ListBox>
        </ListWrapper>
        <ContentWrapper>
          <ContentHeader></ContentHeader>
          <ContentBox></ContentBox>
        </ContentWrapper>
      </Container>
    );
  }
};
