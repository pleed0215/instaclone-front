import React, { Children, useState } from "react";
import styled from "styled-components";

interface CollapseProps {
  collapsed: boolean;
  text: string | null;
}

const SButton = styled.button`
  color: ${(props) => props.theme.color.secondary};
`;

export const Collapse: React.FC<CollapseProps> = ({
  collapsed,
  text,
  children,
}) => {
  const [fold, setFold] = useState(collapsed);
  return (
    <div>
      {!fold && <div>{children}</div>}
      {fold && <SButton onClick={() => setFold(false)}>{text}</SButton>}
    </div>
  );
};
