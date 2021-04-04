import React from "react";
import styled from "styled-components";
import { LayoutContainer } from "./LayoutContainer";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.color.border};
`;

const Layout = styled(LayoutContainer)`
  width: 100%;
  padding: 1rem 0;
  display: flex;
  justify-content: center;
`;

const SpanCopyright = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.color.primary};
`;

export const Footer = () => (
  <Container>
    <Layout>
      <SpanCopyright>
        &copy; From nomadcoders instagram cloning course
      </SpanCopyright>
    </Layout>
  </Container>
);
