import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
  MutationToggleFollow,
  MutationToggleFollowVariables,
} from "../codegen/MutationToggleFollow";

import { ButtonInactivable } from "./ButtonInactivable";

interface ToggleFollowPros {
  isFollowing: boolean;
  authUsername: string;
  username: string;
}

export const GQL_TOGGLE_FOLLOW = gql`
  mutation MutationToggleFollow($input: ToggleFollowUserInput!) {
    toggleFollow(input: $input) {
      ok
      error
    }
  }
`;

export const ToggleFollow: React.FC<ToggleFollowPros> = ({
  isFollowing,
  authUsername,
  username,
}) => {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const client = useApolloClient();
  const [toggleFollow] = useMutation<
    MutationToggleFollow,
    MutationToggleFollowVariables
  >(GQL_TOGGLE_FOLLOW, {
    onCompleted: (data: MutationToggleFollow) => {
      setLoading(false);
      setFollowing((prev) => !prev);
      if (data.toggleFollow.ok) {
        client.cache.modify({
          id: `User: ${authUsername}`,
          fields: {
            totalFollowings(prev) {
              return following ? prev - 1 : prev + 1;
            },
          },
        });
        client.cache.modify({
          id: `User: ${username}`,
          fields: {
            totalFollowers(prev) {
              return following ? prev - 1 : prev + 1;
            },
            isFollowing(prev) {
              return !prev;
            },
          },
        });
      }
    },
  });

  const onClick = () => {
    setLoading(true);
    toggleFollow({
      variables: {
        input: {
          username,
        },
      },
    });
  };
  return (
    <ButtonInactivable
      loading={loading}
      isActivate={!loading}
      onClick={onClick}
    >
      {following ? "언팔로우" : "팔로우"}
    </ButtonInactivable>
  );
};
