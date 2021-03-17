import React from "react";
import styled from "styled-components";

interface CommentUserProps {
  id: number;
  username: string;
}

interface CommentItemProps {
  user: CommentUserProps;
  payload: string;
}

const SpanUsername = styled.span`
  font-weight: 600;
  margin-right: 10px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const SpanComment = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const CommentItem: React.FC<CommentItemProps> = ({ user, payload }) => {
  return (
    <Container>
      <SpanUsername>{user.username}</SpanUsername>
      <SpanComment>{payload}</SpanComment>
    </Container>
  );
};
