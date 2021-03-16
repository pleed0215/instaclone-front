import { gql, useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";
import { useMe } from "../hooks/useMe";
import {PART_PHOTO} from "../fragments"

const GQL_FEED = gql`
  query QuerySeeFeeds($input: SeeFeedsInput!) {
    seeFeeds(input: $input) {
      ok
      error
      totalCount
      totalPage
      currentCount
      currentPage
      pageSize
      feeds {
        ...PartPhoto
      }
    }
  }
  ${PART_PHOTO}
`;

const Container = styled.div`
  min-height: 100vh;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.color};
  background-color: ${(props) => props.theme.background};
`;

export const HomePage = () => {
  const { loading, data, error } = useMe();
  const { loading: loadFeed, data: feeds, error: errorFeed} = useQuery(GQL_FEED,{
    variables: {
      input: {
        page: 1,
        pageSize: 10
      }
    }
  })

  console.log(feeds);

  return (
    <Container>
      <Title>Hello</Title>
    </Container>
  );
};
