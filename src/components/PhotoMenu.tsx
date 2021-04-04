import { gql, useMutation } from "@apollo/client";
import { CopyToClipboard } from "react-copy-to-clipboard";
import React, { MouseEvent, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { toast } from "react-toastify";

interface PhotoMenuProp {
  photoId: number;
  canSee: boolean;
  isOwner: boolean;
  setCanSee: React.Dispatch<boolean>;
}

const GQL_REMOVE_PHOTO = gql`
  mutation MutationRemovePhoto($input: DeletePhotoInput!) {
    deletePhoto(input: $input) {
      ok
      error
    }
  }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(30, 30, 30, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuItemList = styled.ul`
  max-width: 200px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  z-index: 20;
  border-radius: 8px;
  background-color: rgb(233, 233, 233);
  overflow: hidden;
`;

const MenuItem = styled.li<{ color: string; onlyOwner?: boolean }>`
  font-size: 14px;
  color: ${(props) => props.color};
  padding: 15px 0px;
  display: flex;
  justify-content: center;
  transition: background-color 0.3s linear;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    background-color: rgb(200, 200, 200);
  }
  ${(props) =>
    props.onlyOwner &&
    css`
      display: none;
    `};
`;
const MenuSeperator = styled.div`
  height: 1px;
  width: 100%;

  background-color: ${(props) => props.theme.color.border};
`;

export const PhotoMenu: React.FC<PhotoMenuProp> = ({
  photoId,
  isOwner,
  canSee,
  setCanSee,
}) => {
  const toggleVisible = (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (e.target === parentBox.current) {
      setCanSee(!canSee);
    }
  };
  const parentBox = useRef<HTMLDivElement>(null);
  const [deletePhoto] = useMutation(GQL_REMOVE_PHOTO, {
    variables: { input: { id: photoId } },
    onCompleted: (data) => console.log(data),
  });

  useEffect(() => {
    setCanSee(canSee);
  }, [setCanSee, canSee]);

  const onDelete = () => {
    deletePhoto({
      variables: {
        input: {
          id: photoId,
        },
      },
      update: (cache, result) => {
        cache.evict({ id: `Photo:${photoId}` });
        setCanSee(false);
      },
    });
  };

  if (!canSee) return <></>;

  return (
    canSee && (
      <Container ref={parentBox} onClick={toggleVisible}>
        <MenuItemList>
          <CopyToClipboard
            text="지송 아직 라우트 결정 못함"
            onCopy={() => {
              toast.success("클립보드에 복사되었습니다.");
              setCanSee(false);
            }}
          >
            <MenuItem color="blue">링크 복사</MenuItem>
          </CopyToClipboard>
          <MenuSeperator />
          <MenuItem color="red" onClick={onDelete} onlyOwner={!isOwner}>
            삭제하기
          </MenuItem>
        </MenuItemList>
      </Container>
    )
  );
};
