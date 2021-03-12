import React from "react";
import styled from "styled-components";
import { device, breakpoints } from "../theme/theme";

const Container = styled.div`
  @media ${device.xs} {
    max-width: ${breakpoints.xs};
  }
  @media ${device.sm} {
    max-width: ${breakpoints.sm};
  }
  @media ${device.md} {
    max-width: ${breakpoints.md};
  }
  @media ${device.lg} {
    max-width: ${breakpoints.lg};
  }
  /*@media ${device.xl} {
    max-width: ${breakpoints.xl};
  }*/
`;

export const LayoutContainer: React.FC = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};
