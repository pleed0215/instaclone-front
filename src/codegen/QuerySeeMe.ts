/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QuerySeeMe
// ====================================================

export interface QuerySeeMe_seeMe {
  __typename: "User";
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string | null;
}

export interface QuerySeeMe {
  seeMe: QuerySeeMe_seeMe;
}
