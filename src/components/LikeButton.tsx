import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  MutationToggleLike,
  MutationToggleLikeVariables,
} from "../codegen/MutationToggleLike";
import styled from "styled-components";

const GQL_TOGGLE_LIKE = gql`
  mutation MutationToggleLike($input: ToggleLikeInput!) {
    toggleLike(input: $input) {
      ok
      error
    }
  }
`;

interface LikeButtonProps {
  photoId: number;
  isLike: boolean;
}

const SIcon = styled(FontAwesomeIcon)`
  margin-right: 1rem;
  padding: 5px;
  cursor: pointer;
`;

export const LikeButton: React.FC<LikeButtonProps> = ({ photoId, isLike }) => {
  const client = useApolloClient();
  const [like, setLike] = useState(isLike);
  const [toggleLike] = useMutation<
    MutationToggleLike,
    MutationToggleLikeVariables
  >(GQL_TOGGLE_LIKE, {
    onCompleted: () => {
      client.cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          numLikes(prev) {
            return like ? prev + 1 : prev - 1;
          },
        },
      });
    },
  });

  const onLikeClicked = () => {
    toggleLike({
      variables: {
        input: {
          id: photoId,
        },
      },
    });
    setLike(!like);
  };

  return (
    <SIcon icon={like ? faHeart : farHeart} size="2x" onClick={onLikeClicked} />
  );
};
