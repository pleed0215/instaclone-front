import { gql } from "@apollo/client";

export const PART_PHOTO = gql`
  fragment PartPhoto on Photo {
    id
    user {
      id
      username
      firstName
      avatar
    }
    caption
    createdAt
    file
    isMine
    isLiked
    numLikes
    numComments

    comments(take: 2, orderBy: { createdAt: desc }) {
      id
      payload
      isMine
      user {
        id
        username
        avatar
      }
    }
  }
`;
