import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

export const FWIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.color.primary};
`;
