import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { isLoggedInVar, makeLogout } from "../apollo/vars";
import { QuerySeeMe, QuerySeeMe_seeMe } from "../codegen/QuerySeeMe";

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

export const fetchMe = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  let fetchPromise: Promise<QuerySeeMe_seeMe | string | null> | null = null;
  useQuery<QuerySeeMe>(GQL_ME, {
    skip: !isLoggedIn,
    onCompleted: (data: QuerySeeMe) => {
      fetchPromise = new Promise((resolve, reject) => {
        if (data.seeMe) {
          resolve(data.seeMe);
        } else {
          makeLogout();
          reject(
            "Failed to fetch user profile. Maybe it's authentication problem."
          );
        }
      });
    },
  });
  return fetchPromise;
};

export const getMe = async () => {
  return await fetchMe();
};
