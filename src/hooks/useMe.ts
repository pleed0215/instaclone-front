import { gql, useQuery } from "@apollo/client";
import { QuerySeeMe } from "../codegen/QuerySeeMe";

export const GQL_ME = gql`
  query QuerySeeMe {
    seeMe {
      id
      username
      email
      firstName
      lastName
    }
  }
`;

export const useMe = () => {
  return useQuery<QuerySeeMe>(GQL_ME);
};
