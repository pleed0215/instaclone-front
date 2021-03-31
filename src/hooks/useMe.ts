import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../apollo/vars";
import { QuerySeeMe } from "../codegen/QuerySeeMe";

export const GQL_ME = gql`
  query QuerySeeMe {
    seeMe {
      id
      username
      email
      firstName
      lastName
      avatar
    }
  }
`;

export const useMe = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return useQuery<QuerySeeMe>(GQL_ME, {
    skip: !isLoggedIn,
    fetchPolicy: "cache-and-network",
  });
};
