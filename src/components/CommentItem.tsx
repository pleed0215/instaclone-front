import { gql, useMutation } from "@apollo/client";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import {
  MutationRemoveComment,
  MutationRemoveCommentVariables,
} from "../codegen/MutationRemoveComment";
import { PartPhoto_comments } from "../codegen/PartPhoto";
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
  commentId: number;
  payload: string;
  isMine: boolean;
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
  commentId,
  user,
  payload,
  isMine,
}) => {
  const [removeComment] = useMutation<
    MutationRemoveComment,
    MutationRemoveCommentVariables
  >(GQL_REMOVE_COMMENT, {
    /*refetchQueries: [
      {
        query: GQL_REFETCH_PHOTO,
        variables: {
          input: {
            id: photoId,
          },
        },
      },
    ],*/
  });
  const onRemoveClicked = () => {
    removeComment({
      variables: {
        input: {
          id: commentId,
        },
      },
      update: (cache, _) => {
        cache.evict({ id: `Comment:${commentId}` });
        cache.modify({
          id: `Photo:${photoId}`,
          fields: {
            numComments(prev) {
              return prev - 1;
            },
            comments(prev: PartPhoto_comments[]) {
              const safePrev = prev ? prev.slice(0) : [];
              return safePrev.filter(
                (comment: PartPhoto_comments) => comment.id !== commentId
              );
            },
          },
        });
      },
    });
  };
  return (
    <Container>
      <SubContainer>
        <SpanUsername>{user.username}</SpanUsername>
        <SpanComment>{makeLinkText(payload)}</SpanComment>
      </SubContainer>
      {isMine && (
        <ButtonRemove icon={faTrashAlt} size="sm" onClick={onRemoveClicked} />
      )}
    </Container>
  );
};
