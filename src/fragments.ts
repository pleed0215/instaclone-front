import { gql } from "@apollo/client";

export const PART_PHOTO = gql`
  fragment PartPhoto on Photo {
    id
    user {
      id
      username
    }
    caption
    createdAt
    file
    isMine
    numLikes
    numComments
  }
`;
