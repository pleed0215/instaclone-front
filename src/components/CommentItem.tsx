import { gql } from "@apollo/client";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faRemoveFormat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import { makeLinkText } from "../utils";

const GQL_REMOVE_COMMENT = gql`
  mutation MutationRemoveComment($input: DeleteCommentInput!) {
    removeComment(input: $input) {
      ok
      error
    }
  }
`;

interface CommentUserProps {
  id: number;
  username: string;
}

interface CommentItemProps {
  user: CommentUserProps;
  photoId: number;
  payload: string;
}

const SpanUsername = styled.span`
  font-weight: 600;
  margin-right: 10px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SubContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const SpanComment = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  height: 20px;
  display: flex;
  align-items: center;
  width: 100%;
`;

const ButtonRemove = styled(FontAwesomeIcon)`
  cursor: pointer;
  border-radius: 50%;
  &:hover {
    color: ${(props) => props.theme.color.secondary};
  }
`;

export const CommentItem: React.FC<CommentItemProps> = ({
  photoId,
  user,
  payload,
}) => {
  const [removeComment] = useMutation<MutationRemoveComment, MutationRemoveCommentVariables](GQL_REMOVE_COMMENT);
  return (
    <Container>
      <SubContainer>
        <SpanUsername>{user.username}</SpanUsername>
        <SpanComment>{makeLinkText(payload)}</SpanComment>
      </SubContainer>
      <ButtonRemove icon={faTrashAlt} size="sm" />
    </Container>
  );
};
