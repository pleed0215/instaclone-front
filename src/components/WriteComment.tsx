import { gql, useMutation } from "@apollo/client";
import { faKissBeam } from "@fortawesome/free-regular-svg-icons";
import { EmojiButton } from "@joeattardi/emoji-button";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { GQL_REFETCH_PHOTO } from "../apollo/refetch";
import {
  MutationAddComment,
  MutationAddCommentVariables,
} from "../codegen/MutationAddComment";

import { ButtonInactivable } from "./ButtonInactivable";
import { FWIcon } from "./FWIcon";

const GQL_ADD_COMMENT = gql`
  mutation MutationAddComment($input: AddCommentInput!) {
    addComment(input: $input) {
      ok
      error
    }
  }
`;

const WriteCommentContainer = styled.div`
  width: 100%;
  padding: 6px;
  border-top: 1px solid ${(props) => props.theme.color.border};
`;

const FormComment = styled.form`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const ButtonEmoji = styled.button`
  margin-right: 6px;
`;

const TextareaComment = styled.textarea`
  outline: none;
  border: none;
  background-color: transparent;
  resize: none;
  width: 100%;
  height: 20px;
  margin-right: 10px;
  color: ${(props) => props.theme.color.primary};
  font-size: 12px;
`;

const SubmitButton = styled(ButtonInactivable)`
  width: 50px;
`;

interface WriteCommentProps {
  photoId: number;
}

interface CommentForm {
  payload: string;
}

export const WriteComment: React.FC<WriteCommentProps> = ({ photoId }) => {
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
  } = useForm<CommentForm>({ mode: "onChange" });
  const [addComment] = useMutation<
    MutationAddComment,
    MutationAddCommentVariables
  >(GQL_ADD_COMMENT, {
    onCompleted: (_) => {
      setLoading(false);
      setValue("payload", "");
    },
  });

  const [loading, setLoading] = useState(false);
  const emojiButton = useRef<HTMLButtonElement>(null);
  const picker = new EmojiButton();
  picker.on("emoji", (selection) => {
    setValue("payload", getValues("payload") + selection.emoji, {
      shouldValidate: true,
    });
  });
  const onEmojiButtonClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (emojiButton.current) {
      picker.togglePicker(emojiButton.current);
    }
  };

  const onSubmit = () => {
    setLoading(true);
    addComment({
      variables: {
        input: {
          payload: getValues("payload"),
          photoId,
        },
      },
      refetchQueries: [
        {
          query: GQL_REFETCH_PHOTO,
          variables: {
            input: {
              id: photoId,
            },
          },
        },
      ],
    });
  };

  return (
    <WriteCommentContainer>
      <FormComment onSubmit={handleSubmit(onSubmit)}>
        <ButtonEmoji ref={emojiButton} onClick={onEmojiButtonClicked}>
          <FWIcon icon={faKissBeam} size="2x" />
        </ButtonEmoji>
        <TextareaComment
          ref={register({ required: true, minLength: 1 })}
          name="payload"
          placeholder="댓글 달기..."
        />
        <SubmitButton
          isActivate={!loading && formState.isValid}
          loading={loading}
        >
          게시
        </SubmitButton>
      </FormComment>
    </WriteCommentContainer>
  );
};
