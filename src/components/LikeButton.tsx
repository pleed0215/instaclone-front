import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  MutationToggleLike,
  MutationToggleLikeVariables,
} from "../codegen/MutationToggleLike";
import styled from "styled-components";
import { Loader } from "./Loader";

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
  const [toggleLike] = useMutation<
    MutationToggleLike,
    MutationToggleLikeVariables
  >(GQL_TOGGLE_LIKE, {
    onCompleted: (data: MutationToggleLike) => {
      setLoading(false);
    },
  });
  const [loading, setLoading] = useState(false);
  const [like, setLike] = useState(isLike);

  const onLikeClicked = () => {
    setLoading(true);
    toggleLike({
      variables: {
        input: {
          id: photoId,
        },
      },
    });
    setLike(!like);
  };

  return loading ? (
    <Loader />
  ) : (
    <SIcon icon={like ? faHeart : farHeart} size="2x" onClick={onLikeClicked} />
  );
};
