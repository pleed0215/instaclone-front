import React from "react";
import { useQueryParam } from "../hooks/useQueryParams";

export const SearchPage = () => {
  const params = useQueryParam().get("term");
  if (params) {
    return <div>{params}</div>;
  } else {
    return <div>검색어를 입력하여 검색 바랍니다.</div>;
  }
};
