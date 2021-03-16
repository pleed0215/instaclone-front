import { gql } from "@apollo/client";

const PART_PHOTO_DETAIL = gql`
  fragment PartPhotoDetail on Photo {
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
