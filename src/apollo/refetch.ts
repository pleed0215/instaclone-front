import { gql } from "@apollo/client";
import { PART_PHOTO } from "../fragments";

export const GQL_REFETCH_PHOTO = gql`
  query QuerySeePhoto($input: SeePhotoDetailInput!) {
    seePhotoDetail(input: $input) {
      ok
      error
      photo {
        ...PartPhoto
      }
    }
  }
  ${PART_PHOTO}
`;
